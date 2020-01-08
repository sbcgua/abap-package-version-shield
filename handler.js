'use strict';
const https = require('https');

// eslint-disable-next-line no-unused-vars
module.exports.getShieldJson = async (event, context, callback) => {
    try {
        // return buildResponse({ event, context });
        return await handleEvent(event, context);
    } catch (error) {
        console.error(error);
        return buildErrorResponce(error.message, 400);
    }
};

// eslint-disable-next-line no-unused-vars
async function handleEvent(event, context) {
    // queryStringParameters
    // console.log('Request params', event.queryStringParameters);
    // const validatedParams = validateQueryParams(event.queryStringParameters);

    // path params
    console.log('Requested path', event.path);
    const validatedParams = validateAndParsePath(event.resource, event.path);

    const url = createUrlFromParams(validatedParams);
    const srcData = await fetchResource(url);
    const version = parseSourceFile(srcData, validatedParams.attr);
    const response = buildSuccessResponse(version);
    return response;
}

const enumify = list => Object.freeze(list.reduce((prev, i, index) => Object.assign(prev, { [i]: index }), {}));

function validateAndParsePath(resource, path) {
    const prefixLen = resource.indexOf('{sourcePath');
    if (prefixLen < 0) throw Error('Incorrect resource name');
    const paramPath = path.substr(prefixLen);
    const segments = paramPath.split('/').filter(s => s !== '');
    if (segments.length === 0) throw Error('Unexpected path');

    const STATES = enumify(['TYPE', 'OWNER', 'REPO', 'FILE', 'ATTR', 'END']);
    let expected = STATES.TYPE;
    let params = {};
    for (const seg of segments) {
        switch (expected) {
        case STATES.TYPE:
            params.type = seg;
            expected++;
            break;
        case STATES.OWNER:
            params.owner = seg;
            expected++;
            break;
        case STATES.REPO:
            params.repo = seg;
            expected++;
            break;
        case STATES.FILE:
            if (/\.abap$/i.test(seg)) expected++;
            params.file ? (params.file += '/') : (params.file = '');
            params.file += seg;
            break;
        case STATES.ATTR:
            params.attr = seg;
            expected++;
            break;
        case STATES.END:
            throw Error('Unexpect path segment');
        default:
            throw Error('Unexpected parsing state');
        }
    }
    return validateQueryParams(params);
}

function validateQueryParams(params) {
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

function buildResponse(body, code = 200) {
    const response = {
        statusCode: code,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    };
    return response;
}

function buildSuccessResponse(version) {
    return buildResponse({
        message: version,
        schemaVersion: 1,
        label: 'abap package version',
        color: 'orange',
    });
}

function buildErrorResponce(message, code = 400) {
    return buildResponse({ message }, code);
}
