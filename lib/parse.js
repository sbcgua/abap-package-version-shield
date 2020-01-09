function parseSourceFile(fileData, attrName) {
    const abapConstantRe = new RegExp(`constants\\s+${attrName}\\s+(type\\s+\\S+\\s+)?value\\s+(?<attrValue>\\S+)(\\s|\\.)`, 'i');
    const match = abapConstantRe.exec(fileData);
    if (!match || !match.groups || !match.groups.attrValue) {
        throw Error('Could not find attr in the file');
    }
    let version = match.groups.attrValue;
    if (/^'\S+'$/.test(version)) version = version.slice(1,-1);
    return version;
}

module.exports = {
    parseSourceFile,
};
