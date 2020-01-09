const {
    enumify,
} = require('./utils');

function parsePathParams({pathParameters}) {
    if (!pathParameters) throw Error('Unexpected path');
    if (!pathParameters.sourcePath) throw Error('Unexpected source path');
    const segments = pathParameters.sourcePath.split('/').filter(s => s !== '');
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
    return params;
}

function validateQueryParams(params) {
    if (!params.type) throw Error('Repository type not specified'); // 400 bad request
    if (!params.owner) throw Error('Owner not specified');
    if (!params.repo) throw Error('Repository name not specified');
    if (!params.file) throw Error('Source file not specified');

    const supportedTypes = ['github'];
    if (!supportedTypes.includes(params.type)) throw Error('Repository type not supported');

    const allowedSymbols = /^[-_.,0-9a-zA-Z/]+$/;
    for (const attr of ['owner', 'repo', 'file', 'attr']) {
        if (!Object.prototype.hasOwnProperty.call(params, attr)) continue;
        if (!allowedSymbols.test(params[attr])) throw Error(`[${attr}] has disallowed symbols`);
    }

    return {
        type: params.type,
        owner: params.owner,
        repo: params.repo,
        file: params.file,
        attr: params.attr || 'version',
    };
}

module.exports = {
    parsePathParams,
    validateQueryParams,
};
