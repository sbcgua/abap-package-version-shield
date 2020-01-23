# Dev notes

## Useful
- https://stackify.com/aws-lambda-with-node-js-a-complete-getting-started-guide/
- https://postman-echo.com/get?foo1=bar1

## Deployment
- `serverless config credentials --provider aws --key <your_access_key_id> --secret <your_access_key_secret>`
- `serverless deploy`
- `serverless logs -f getAbapVersionShieldJson --stage dev`
- `serverless info -f getAbapVersionShieldJson --stage dev` - url in particular
- `sls create_domain`, `sls delete_domain`
- `bin/deploy-dev.sh`
- `bin/deploy-prod.sh`
