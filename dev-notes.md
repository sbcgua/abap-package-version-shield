# Dev notes

## Useful
- https://stackify.com/aws-lambda-with-node-js-a-complete-getting-started-guide/
- https://postman-echo.com/get?foo1=bar1

### serverless domain name per stage

- https://forum.serverless.com/t/custom-domain-for-different-stages/4539/4
- https://github.com/amplify-education/serverless-domain-manager/issues/60
- https://stackoverflow.com/questions/46956660/how-to-set-up-different-domains-based-on-stage-with-serverless-domain-manager-pl
- http://www.piotrnowicki.com/2019/06/aws-serverless-stage-promotion/

## Deployment
- `serverless config credentials --provider aws --key <your_access_key_id> --secret <your_access_key_secret>`
- `serverless deploy`
- `serverless logs -f getAbapVersionShieldJson --stage dev`
- `serverless info -f getAbapVersionShieldJson --stage dev` - url in particular
- `sls create_domain`, `sls delete_domain`
- `bin/deploy-dev.sh`
- `bin/deploy-prod.sh`

## Useful
- `serverless package` - check what will be in zip package (built in .serverless dir)

## redirect
- https://alestic.com/2015/11/amazon-api-gateway-aws-cli-redirect/
- https://medium.com/@lakshmanLD/lambda-proxy-vs-lambda-integration-in-aws-api-gateway-3a9397af0e6d
- https://github.com/jnupponen/apigw-redirect/blob/master/template.yaml
- http://docs.yaybu.com/projects/touchdown/en/stable/tutorial/redirects_with_apigateway.html
