import glob
import pydicom
import os
import numpy as np
from pydicom.pixel_data_handlers.util import apply_voi_lut
from google.cloud import storage
from lime import lime_image
from skimage.segmentation import mark_boundaries

explainer = lime_image.LimeImageExplainer()

gcp_project = os.environ["GCP_PROJECT"]
bucket_name = "finespine_data"

def upload_to_gcp(filename, folder, patient_id):
    storage_client = storage.Client.from_service_account_json(os.environ["GOOGLE_APPLICATION_CREDENTIALS"])
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(f'{folder}/{patient_id}.png')
    blob.content_type = 'image/png'
    blob.upload_from_filename(filename)

def download_from_gcp(patient_id, filename, folder):
    try:
        storage_client = storage.Client.from_service_account_json(os.environ["GOOGLE_APPLICATION_CREDENTIALS"])
        bucket = storage_client.get_bucket(bucket_name)
        blob = bucket.blob(f'{folder}/{patient_id}.png')
        blob.download_to_filename(filename)
    except:
        raise Exception('File unable to download or does not exist')
        
def get_dcm_images(path):
    paths = list(glob.glob(os.path.join(path,"*")))
#     print(paths)
    paths.sort(key=lambda x:int(os.path.basename(x).split(".")[0])) # sort based on slice index which is the filename: index.dcm
    z_first = pydicom.dcmread(paths[0]).get("ImagePositionPatient")[-1]
    z_last = pydicom.dcmread(paths[-1]).get("ImagePositionPatient")[-1]
    data = [pydicom.dcmread(f) for f in paths]
    images = np.array([apply_voi_lut(dcm.pixel_array, dcm) for dcm in data])
    if z_last < z_first:
        return images
    else:
        return images[::-1]

def explain_prediction(model, image):
    explanation = explainer.explain_instance(image[0].astype('double'), model.predict, labels=(0,),
                                         top_labels=1, hide_color=0, num_samples=100)
    temp_2, mask_2 = explanation.get_image_and_mask(explanation.top_labels[0], positive_only=True, num_features=5, hide_rest=False)
    explain_image = mark_boundaries(temp_2, mask_2)
    return explain_image