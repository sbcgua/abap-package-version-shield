#!/usr/bin/env node

const handler = require('./handler');

(async function main() {
    const event = {
        queryStringParameters: {
            type: 'github',
            owner: 'sbcgua',
            repo: 'mockup_loader',
            file: 'src/zif_mockup_loader_constants.intf.abap',
            attr: 'version',
        },
        resource: '/get-abap-version-shield-json/{sourcePath}',
        path: '/get-abap-version-shield-json/github/sbcgua/mockup_loader/src/zif_mockup_loader_constants.intf.abap/version',
        pathParameters: {
            sourcePath: 'github/sbcgua/mockup_loader/src/zif_mockup_loader_constants.intf.abap/version'
        },
    };
    const context = {

    };

    let result = await handler.getShieldJson(event, context);
    if (result instanceof Promise) result = await result;
    console.log(result);
})();
