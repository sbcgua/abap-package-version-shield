#!/bin/sh
echo "Deploying PROD lambda ..."
serverless deploy --region eu-west-1 --stage prod
