#!/bin/sh
STAGE=dev

echo "Creating $STAGE domain ..."
serverless create_domain --stage $STAGE

echo "Deploying $STAGE lambda ..."
serverless deploy --stage $STAGE
