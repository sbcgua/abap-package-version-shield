#!/usr/bin/env node

const handler = require('./handler');

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

    let result = await handler.getShieldJson(event, context);
    if (result instanceof Promise) result = await result;
    console.log(result);
})();
