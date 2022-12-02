#!/bin/bash

# exit immediately if a command exits with a non-zero status
set -e

# Define some environment variables
export IMAGE_NAME="finespine-app-deployment"
export BASE_DIR=$(pwd)
export GCP_PROJECT="ai5-c3-group18" # Change to your GCP Project
export GCP_ZONE="us-central1-a"
export GOOGLE_APPLICATION_CREDENTIALS=/secrets/deployment.json
export USE_GKE_GCLOUD_AUTH_PLUGIN=True

# Build the image based on the Dockerfile
docker build -t $IMAGE_NAME -f Dockerfile .

# Run the container
docker run --rm --name $IMAGE_NAME -ti \
-v /var/run/docker.sock:/var/run/docker.sock \
--mount type=bind,source=$BASE_DIR,target=/app \
--mount type=bind,source=$BASE_DIR/../secrets/,target=/secrets \
--mount type=bind,source=$HOME/.ssh,target=/home/app/.ssh \
--mount type=bind,source=$BASE_DIR/../api-service,target=/api-service \
--mount type=bind,source=$BASE_DIR/../frontend-react,target=/frontend-react \
-e GOOGLE_APPLICATION_CREDENTIALS=$GOOGLE_APPLICATION_CREDENTIALS \
-e GCP_PROJECT=$GCP_PROJECT \
-e GCP_ZONE=$GCP_ZONE $IMAGE_NAME \
-e USE_GKE_GCLOUD_AUTH_PLUGIN=$USE_GKE_GCLOUD_AUTH_PLUGIN 

