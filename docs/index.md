# ABAP package version shield

There is an amazing service [shields.io](https://shields.io/) that produces github status badges. In particular, it can retrieve shield configuration from another API. This piece of code implements such API endpoint for extracting abap package version.

![shield sample](shield-sample.svg)

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

For example: [`https://img.shields.io/endpoint?url=https://shield.abap.space/version-shield-json/github/sbcgua/mockup_loader/src/zif_mockup_loader.intf.abap/version`](https://img.shields.io/endpoint?url=https://shield.abap.space/version-shield-json/github/sbcgua/mockup_loader/src/zif_mockup_loader.intf.abap/version) for the following target file.

![example](code-example.png)

### Notes

- The version is supposed to be in semantic version format - `'X.Y.Z'` or `'vX.Y.Z'`.
- if `$PATH` = `.apack-manifest.xml` the version is read directly from that file.

### Badge customizing

Shields.io allows to override some of parameters e.g. label and color - see more in [their documentation](https://shields.io/). For example: `https://img.shields.io/endpoint?url=...&label=version&color=red` to display the shield in red and with shorter "version" label instead of "abap package version".

*N.B. Please report bugs if found :)*

## Badge constructor

*beta, pls report issue if any!*

{% include badge-constructor.html %}
