SET IMAGE_NAME="finespine-app-deployment"
SET GCP_PROJECT="ai5-c3-group18"
SET GCP_ZONE="us-central1-a"
SET GOOGLE_APPLICATION_CREDENTIALS=/secrets/deployment.json
SET USE_GKE_GCLOUD_AUTH_PLUGIN=True

docker build -t %IMAGE_NAME% -f Dockerfile .
cd ..
docker run --rm --name %IMAGE_NAME% -ti ^
           -v /var/run/docker.sock:/var/run/docker.sock ^
           --mount type=bind,source="%cd%\deployment",target=/app ^
           --mount type=bind,source="%cd%\secrets",target=/secrets ^
           --mount type=bind,source="%USERPROFILE%\.ssh",target=/home/app/.ssh ^
           --mount type=bind,source="%cd%\api-service",target=/api-service ^
           --mount type=bind,source="%cd%\frontend-react",target=/frontend-react ^
           -e GOOGLE_APPLICATION_CREDENTIALS="%GOOGLE_APPLICATION_CREDENTIALS%" ^
           -e GCP_PROJECT="%GCP_PROJECT%" ^
           -e USE_GKE_GCLOUD_AUTH_PLUGIN="%USE_GKE_GCLOUD_AUTH_PLUGIN%" ^
           -e GCP_ZONE="%GCP_ZONE%" %IMAGE_NAME%
