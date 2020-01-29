[![Known Vulnerabilities](https://snyk.io/test/github/sbcgua/abap-package-version-shield/badge.svg?targetFile=package.json)](https://snyk.io/test/github/sbcgua/abap-package-version-shield?targetFile=package.json)

# ABAP package version shield

**ATTENTION: BETA VERSION, use with care, report issues pls!**

## Usage

There is an amazing service [shields.io](https://shields.io/) that produces github status badges. In particular, it can retrieve shield configuration from another API. This piece of code implements such API endpoint for extracting abap package version.

![shield sample](docs/shield-sample.svg)

The service is available at `shield.abap.space` domain. In order to add a badge to your repository add the following line at the top of your root readme file.

```
![abap package version](https://img.shields.io/endpoint?url=https://shield.abap.space/version-shield-json/$TYPE/$OWNER/$REPO/$PATH/$CONSTANT_NAME)
```

where:
- $TYPE = 'github' (only this for now)
- $OWNER = your github user name
- $REPO = you repo name
- $PATH = path to abap file with version constant
- $CONSTANT_NAME = constant name to search version in (optional, "version" by default)

For example: [`https://img.shields.io/endpoint?url=https://shield.abap.space/version-shield-json/github/sbcgua/mockup_loader/src/zif_mockup_loader_constants.intf.abap/version`](https://img.shields.io/endpoint?url=https://shield.abap.space/version-shield-json/github/sbcgua/mockup_loader/src/zif_mockup_loader_constants.intf.abap/version)

![example](docs/code-example.png)

### Notes

- The version is supposed to be in semantic version format - `'X.Y.Z'` or `'vX.Y.Z'`.
- if `$PATH` = `.apack-manifest.xml` the version is read directly from that file.
