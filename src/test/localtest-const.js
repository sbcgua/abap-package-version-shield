#!/usr/bin/env node

const handler = require('../handler');

(async function main() {
    const event = {
        resource: '/version-shield-json/{sourcePath}',
        path: '/version-shield-json/github/sbcgua/mockup_loader/src/zif_mockup_loader.intf.abap/version',
        pathParameters: {
            sourcePath: 'github/sbcgua/mockup_loader/src/zif_mockup_loader.intf.abap/version'
        },
    };
    const context = {

    };

    let result = await handler.getShieldJson(event, context);
    if (result instanceof Promise) result = await result;
    console.log(result);
})();
