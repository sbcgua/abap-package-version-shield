const xml = require('xml-parse');
const APACK_FILENAME = 'apack-manifest.xml';
const { xmlGetChildrenOf } = require('./utils');

function getVersionFromApack(str) {
    let parsedXML;
    try {
        parsedXML = xml.parse(str);
    } catch (error) {
        throw Error('apack xml parsing error');
    }

    const versionNodeChildren = xmlGetChildrenOf(parsedXML, 'DATA/VERSION');
    if (!versionNodeChildren) throw Error('wrong apack xml structure');
    const versionText = versionNodeChildren.find(node => node.type === 'text');
    if (!versionText) throw Error('wrong apack xml structure');
    return versionText.text;
}

module.exports = {
    APACK_FILENAME,
    getVersionFromApack,
};
