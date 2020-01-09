function parseSourceFile(fileData, attrName) {
    const abapConstantRe = new RegExp(`constants:?\\s+${attrName}\\s+(type\\s+\\S+\\s+)?value\\s+'(?<attrValue>[^']+)'`, 'i');
    const match = abapConstantRe.exec(fileData);
    if (!match || !match.groups || !match.groups.attrValue) {
        throw Error('Could not find attr in the file');
    }
    let version = match.groups.attrValue;
    // if (/^'\S+'$/.test(version)) version = version.slice(1,-1);
    return version;
}

function validateVersion(version) {
    const versionRe = /^v?\d{1,3}\.\d{1,3}\.\d{1,3}$/i;
    if (!versionRe.test(version)) throw Error('Unexpected version format');
}

module.exports = {
    validateVersion,
    parseSourceFile,
};
