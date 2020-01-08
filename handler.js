'use strict';
const https = require('https');

// eslint-disable-next-line no-unused-vars
module.exports.getShieldJson = async (event, context, callback) => {
    try {
        return await handleEvent(event, context);
    } catch (error) {
        console.error(error);
        return buildErrorResponce(error.message, 400);
    }
};

// eslint-disable-next-line no-unused-vars
async function handleEvent(event, context) {
    console.log('Request params', event.queryStringParameters);
    const validatedParams = validateParams(event.queryStringParameters);
    const url = createUrlFromParams(validatedParams);
    const srcData = await fetchResource(url);
    const version = parseSourceFile(srcData, validatedParams.attr);
    const response = buildResponse(version);
    return response;
}

function validateParams(params) {
    if (!params.type) throw Error('Repository type not specified'); // 400 bad request
    if (!params.owner) throw Error('Owner not specified');
    if (!params.repo) throw Error('Repository name not specified');
    if (!params.file) throw Error('Src file not specified');

    // TODO validate string content 0-9a-z_- ?

    const supportedTypes = ['github'];
    if (!supportedTypes.includes(params.type)) throw Error('Repository type not supported');

    return {
        type: params.type,
        owner: params.owner,
        repo: params.repo,
        file: params.file,
        attr: params.attr || 'version',
    };
}

function createUrlFromParams({type, owner, repo, file}) {
    if (type === 'github') {
        const url = `https://raw.githubusercontent.com/${owner}/${repo}/master/${file}`;
        console.log('URL:', url);
        return url;
    }
}

function fetchResource(url) {
    return new Promise((resolve, reject) => {
        let buf = Buffer.from([]);
        const request = https.get(url, res => {
            console.log(`fetch statusCode: ${res.statusCode}`);
            res.on('data', data => {
                buf = Buffer.concat([buf, data]);
            });
            res.on('end', () => {
                resolve(buf.toString());
            });
        });

        request.on('error', error => {
            console.error(error);
            reject(error);
        });
    });
}

function parseSourceFile(fileData, attrName) {
    const abapConstantRe = new RegExp(`constants\\s+${attrName}\\s+(type\\s+\\S+\\s+)?value\\s+(\\S+)\\s*\\.`, 'i');
    const match = abapConstantRe.exec(fileData);
    // console.log(abapConstantRe);
    // console.log(match);
    if (!match || !match[2]) { // TODO named groups
        throw Error('Could not find attr in the file');
    }
    let version = match[2];
    if (/^'\S+'$/.test(version)) version = version.slice(1,-1);
    return version;
}

function buildResponse(version) {
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: version,
            schemaVersion: 1,
            label: 'abap package version',
            color: 'orange',
        }),
    };
    return response;
}

function buildErrorResponce(message, code = 400) {
    return {
        statusCode: code,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message,
        }),
    };
}
