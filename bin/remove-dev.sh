#!/bin/sh
STAGE=dev

echo "Deleting $STAGE domain ..."
serverless delete_domain --stage $STAGE

echo "Deleting $STAGE lambda ..."
serverless remove --stage $STAGE
