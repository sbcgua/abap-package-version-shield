const {
    enumify,
} = require('./utils');
const { APACK_FILENAME } = require('./apack');
const pick = require('lodash.pick');

function parsePathParams({pathParameters}) {
    if (!pathParameters) throw Error('Unexpected path');
    if (!pathParameters.sourcePath) throw Error('Unexpected source path');
    const segments = pathParameters.sourcePath.split('/').filter(s => s !== '');
    if (segments.length === 0) throw Error('Unexpected path');

    const STATES = enumify(['TYPE', 'OWNER', 'REPO', 'FILE', 'ATTR', 'END']);
    let expected = STATES.TYPE;
    let params = {};
    for (const seg of segments) {
        const appendSeg = (param) => param ? (param + '/' + seg) : seg;
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
            params.file = appendSeg(params.file);
            if (/\.abap$/i.test(seg) || seg === APACK_FILENAME) expected++;
            break;
        case STATES.ATTR:
            if (params.file === APACK_FILENAME) {
                if (!params.apackExtra) params.apackExtra = seg;
                else params.apackExtraParam = appendSeg(params.apackExtraParam);
            } else {
                params.attr = seg;
                expected++;
            }
            break;
        case STATES.END:
            throw Error('Unexpect path segment');
        default:
            throw Error('Unexpected parsing state');
        }
    }
    return params;
}

function applyDefaults(params) {
    const final = {...params};
    if (!final.attr && final.file !== APACK_FILENAME) final.attr = 'version';
    return final;
}

function validateQueryParams(params) {
    if (!params.type) throw Error('Repository type not specified'); // 400 bad request
    if (!params.owner) throw Error('Owner not specified');
    if (!params.repo) throw Error('Repository name not specified');
    if (!params.file) throw Error('Source file not specified');

    const supportedTypes = ['github'];
    if (!supportedTypes.includes(params.type)) throw Error('Repository type not supported');

    if ((params.apackExtra || params.apackExtraParam) && params.file !== APACK_FILENAME) throw Error('Apack params consistency failed');

    const supportedApackExtraActions = ['dependencies'];
    if (params.apackExtra && !supportedApackExtraActions.includes(params.apackExtra)) throw Error('Wrong apack extra action');

    const allAttrs = ['type', 'owner', 'repo', 'file', 'attr', 'apackExtra', 'apackExtraParam'];
    const allowedSymbols = /^[-_.,0-9a-zA-Z/]+$/;
    for (const attr of allAttrs) {
        if (!Object.prototype.hasOwnProperty.call(params, attr)) continue;
        if (!allowedSymbols.test(params[attr])) throw Error(`[${attr}] has disallowed symbols`);
    }

    if (params.apackExtra === 'dependencies' && !params.apackExtraParam) throw Error('dependencies action expect params');

    return applyDefaults(pick(params, allAttrs));
}

module.exports = {
    parsePathParams,
    validateQueryParams,
};
