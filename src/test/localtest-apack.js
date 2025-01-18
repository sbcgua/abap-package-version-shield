#!/usr/bin/env node

import { getShieldJson } from '../handler.js';

// 2021-08: SAP-samples/abap-platform-jak has incorrect semver version (X.Y, must be X.Y.Z)

(async function main() {
    const event = {
        resource: '/version-shield-json/{sourcePath}',
        path: '/version-shield-json/github/SAP-samples/abap-platform-jak/.apack-manifest.xml',
        pathParameters: {
            sourcePath: 'github/SAP-samples/abap-platform-jak/.apack-manifest.xml'
        },
    };
    const context = {

    };

    let result = await getShieldJson(event, context);
    if (result instanceof Promise) result = await result;
    console.log(result);
})();
