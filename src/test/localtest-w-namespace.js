#!/usr/bin/env node

import { getShieldJson } from '../handler.js';

(async function main() {
    const event = {
        resource: '/version-shield-json/{sourcePath}',
        path: '/version-shield-json/github/Marc-Bernard-Tools/MBT-Base/src/tools/%23mbtools%23cl_tool_bc.clas.abap',
        pathParameters: {
            sourcePath: 'github/Marc-Bernard-Tools/MBT-Base/src/tools/%23mbtools%23cl_tool_bc.clas.abap'
        },
    };
    const context = {

    };

    let result = await getShieldJson(event, context);
    if (result instanceof Promise) result = await result;
    console.log(result);
})();
