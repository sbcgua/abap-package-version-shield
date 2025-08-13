import { fetchResource, buildResponse } from './lib/utils.js';
import { parsePathParams, validateQueryParams } from './lib/params.js';
import { validateVersion, parseSourceFile } from './lib/parse.js';
import { APACK_FILENAME, getVersionFromApack, getDependencyVersionFromApack } from './lib/apack.js';
import pkg from '../package.json' with { type: 'json' };

export async function getShieldJson (event, context) {
    try {
        return await handleEvent(event, context);
    } catch (error) {
        console.error(error);
        return buildErrorResponce(String(error), 400);
    }
};

export async function errorStub() {
    console.error('Unexpected call');
    return buildErrorResponce('Unexpected call', 400);
};

// eslint-disable-next-line no-unused-vars
async function handleEvent(event, context) {
    console.log('Requested path:', event.path);

    if (!event.pathParameters) throw Error('Unexpected pathParameters');
    if (!event.pathParameters.sourcePath) throw Error('Unexpected pathParameters.sourcePath');
    if (event.pathParameters.sourcePath === 'version') {
        return processOwnVersionRequest();
    } else {
        return await processShieldRequest(event.pathParameters);
    }
}

function processOwnVersionRequest() {
    return buildResponse({
        name: pkg.name,
        version: pkg.version,
    });
}

async function processShieldRequest(pathParameters) {
    const params = parsePathParams(pathParameters);
    const validatedParams = validateQueryParams(params);
    const url = createUrlFromParams('master', validatedParams); // TODO handle branches, also check main by default
    const srcData = await fetchResource(url);
    let version = (validatedParams.file === APACK_FILENAME)
        ? validatedParams.apackExtra === 'dependencies'
            ? getDependencyVersionFromApack(srcData, validatedParams.apackExtraParam)
            : getVersionFromApack(srcData)
        : parseSourceFile(srcData, validatedParams.attr);

    validateVersion(version);
    if (/\d/.test(version[0])) version = 'v' + version;
    const response = buildSuccessResponse(version);
    return response;
}

function createUrlFromParams(branch, {type, owner, repo, file}) {
    if (type === 'github') {
        const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file}`;
        console.log('URL:', url);
        return url;
    // TODO support for gitlab, bitbucket, azure ...
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
