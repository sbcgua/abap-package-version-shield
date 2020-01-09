'use strict';

const {
    fetchResource,
    buildResponse,
} = require('./lib/utils');

const {
    parsePathParams,
    validateQueryParams,
} = require('./lib/params');

const {
    validateVersion,
    parseSourceFile,
} = require('./lib/parse');

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
    console.log('Requested path', event.path);

    const params = parsePathParams(event);
    const validatedParams = validateQueryParams(params);
    const url = createUrlFromParams(validatedParams);
    const srcData = await fetchResource(url);
    const version = parseSourceFile(srcData, validatedParams.attr);
    validateVersion(version);
    const response = buildSuccessResponse(version);
    return response;
}

function createUrlFromParams({type, owner, repo, file}) {
    if (type === 'github') {
        const url = `https://raw.githubusercontent.com/${owner}/${repo}/master/${file}`;
        console.log('URL:', url);
        return url;
    } else {
        throw Error('Unexpected url type');
    }
}

function buildSuccessResponse(version) {
    const SHILED_LABEL = 'abap package version';
    return buildResponse({
        message: version,
        schemaVersion: 1,
        label: SHILED_LABEL,
        color: 'orange',
    });
}

function buildErrorResponce(message, code = 400) {
    return buildResponse({ message }, code);
}
