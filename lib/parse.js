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
    // Based on official semver spec
    // https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
    const versionRe = /^(v|V)?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
    if (!versionRe.test(version)) throw Error('Unexpected version format');
}

module.exports = {
    validateVersion,
    parseSourceFile,
};
