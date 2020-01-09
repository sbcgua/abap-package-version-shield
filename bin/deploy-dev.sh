#!/bin/sh
echo "Deploying DEV lambda ..."
serverless deploy --region eu-west-1 --stage dev
