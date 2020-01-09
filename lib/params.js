const {
    enumify,
} = require('./utils');

function parsePathParams(resource, path) {
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
    return params;
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

module.exports = {
    parsePathParams,
    validateQueryParams,
};
