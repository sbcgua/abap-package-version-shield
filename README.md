# ABAP package version shield

**ATTENTION: BETA VERSION, use with care**

## Usage

There is an amazing service [shields.io](https://shields.io/) that produces github status badges. In particular, it can retrieve shield configuration from another API. This piece of code implements such API endpoint for extracting abap package version.

![shield sample](docs/shield-sample.svg)

The service is available at version.abap.space domain. In order to add a badge to your repository add the following line at the top of your root readme file.

`https://img.shields.io/endpoint?url=https://shield.abap.space/get-abap-version-shield-json/$TYPE/$OWNER/$REPO/$PATH/$CONSTANT_NAME`

where:
- $TYPE = 'github' (only this for now)
- $OWNER = your github user name
- $REPO = you repo name
- $PATH = path to abap file with version constant
- $CONSTANT_NAME = constant name to search version in (optional, "version" by default)

For example: [`https://img.shields.io/endpoint?url=https://shield.abap.space/get-abap-version-shield-json/github/sbcgua/mockup_loader/src/zif_mockup_loader_constants.intf.abap/version`](https://img.shields.io/endpoint?url=https://shield.abap.space/get-abap-version-shield-json/github/sbcgua/mockup_loader/src/zif_mockup_loader_constants.intf.abap/version)

- The version is supposed to be in semantic version format - `'X.Y.Z'` or `'vX.Y.Z'`.
- if `$PATH` = `.apack-manifest.xml` the version is read directly from that file.

## Development

https://img.shields.io/endpoint?url=https://{LAMBDA}.execute-api.eu-west-1.amazonaws.com/dev/get-abap-version-shield-json/type/owner/repo/file/attr

Example: https://img.shields.io/endpoint?url=https://{LAMBDA}.execute-api.eu-west-1.amazonaws.com/dev/get-abap-version-shield-json/github/sbcgua/mockup_loader/src/zif_mockup_loader_constants.intf.abap/version

## Useful
- https://stackify.com/aws-lambda-with-node-js-a-complete-getting-started-guide/
- https://postman-echo.com/get?foo1=bar1

## Deployment
- `serverless config credentials --provider aws --key <your_access_key_id> --secret <your_access_key_secret>`
- `serverless deploy`
- `serverless logs -f getAbapVersionShieldJson --stage dev`
- `serverless info -f getAbapVersionShieldJson --stage dev` - url in particular
- `sls create_domain`, `sls delete_domain`
