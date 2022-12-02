from fastapi import FastAPI, status, Form
from starlette.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile
from fastapi.exceptions import HTTPException
import shutil, os, aiofiles
from matplotlib import pyplot as plt
import zipfile, base64
from .helper import get_dcm_images, upload_to_gcp, download_from_gcp, explain_prediction
import tempfile
import tensorflow as tf
import numpy as np
import tensorflow_addons as tfa
from io import BytesIO
from keras.utils import array_to_img

MODEL_NAME = "saggital_xception"
model = tf.keras.models.load_model(os.path.join('./models',MODEL_NAME))

CHUNK_SIZE = 1024 * 1024  # adjust the chunk size as desired

# Setup FastAPI app
app = FastAPI(
    title="API Server",
    description="API Server",
    version="v1"
)

# Enable CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
def base64_encode_img(img):
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    buffered.seek(0)
    img_byte = buffered.getvalue()
    encoded_img = "data:image/png;base64," + base64.b64encode(img_byte).decode()
    return encoded_img

# Routes
@app.get("/")
async def get_index():
    return {
        "message": "Welcome to the FineSpine API Service"
    }

@app.post("/predict")
async def predict(patient_id: str = Form()):
    try:
        with tempfile.TemporaryDirectory() as tmpdirname:
            filepath = os.path.join(tmpdirname, str(patient_id)+'.png')
            #save file locally
            download_from_gcp(patient_id, filepath,'saggital')
            image = tf.io.read_file(filepath)
            image = tf.image.decode_png(image, channels=3)
            image = tf.image.resize(image/255, [255,255])
            image = np.expand_dims(image, axis=0)
            prob = model.predict(image).ravel()[0]
            explain_image = explain_prediction(model, image)
            # explain_image.save("./test.png")
        return {"probability":str(round(prob,2)),
                "image":base64_encode_img(array_to_img(image[0])),
                "explain":base64_encode_img(array_to_img(explain_image))}

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail='There was an error predicting '+str(e))

@app.post("/upload")
async def upload(patient_id: str = Form(),file: UploadFile = File(...)):
    try:
        with tempfile.TemporaryDirectory() as tmpdirname:
            filepath = os.path.join(tmpdirname, os.path.basename(file.filename))
            # print(patient_id, filepath)
            #save file locally
            async with aiofiles.open(filepath, 'wb') as f:
                while chunk := await file.read(CHUNK_SIZE):
                    await f.write(chunk)
            # extract file
            zip_dir = os.path.join(tmpdirname,'extract')
            # os.makedirs(zip_dir,mode = 0o777, exist_ok=True)
            with zipfile.ZipFile(filepath, 'r') as zip_ref:
                zip_ref.extractall(zip_dir)

            #read dicom images
            image = get_dcm_images(zip_dir)
            #save images
            saggital_filename = os.path.join(tmpdirname, f'saggital_{patient_id}.png')
            coronal_filename = os.path.join(tmpdirname, f'coronal_{patient_id}.png')
            plt.imsave(saggital_filename,image[:,:,image.shape[-1]//2],cmap='bone')
            plt.imsave(coronal_filename,image[:,image.shape[1]//2,:],cmap='bone')
            #upload images
            upload_to_gcp(saggital_filename,'saggital', patient_id)
            upload_to_gcp(coronal_filename,'coronal', patient_id)
            
        return {"message": f"Successfuly processed and uploaded files for patient {patient_id}"}

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail='There was an error uploading the file '+str(e))
    finally:
        await file.close()


