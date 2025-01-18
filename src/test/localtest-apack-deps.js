#!/usr/bin/env node

const handler = require('../handler');

// 2021-08: mbtools/mbt-versions is offline

(async function main() {
    const event = {
        // resource: '/version-shield-json/{sourcePath}',
        // path: '/version-shield-json/github/SAP-samples/abap-platform-jak/.apack-manifest.xml',
        pathParameters: {
            sourcePath: 'github/mbtools/mbt-versions/.apack-manifest.xml/dependencies/github.com/mbtools/mbt-bc-cts-req'
        },
    };
    const context = {

    };

    let result = await handler.getShieldJson(event, context);
    if (result instanceof Promise) result = await result;
    console.log(result);
})();
