var parser = require('fast-xml-parser');
const APACK_FILENAME = '.apack-manifest.xml';
const { xmlGetChildrenOf } = require('./utils');

function parseXml(xmlStr) {
    try {
        return parser.parse(xmlStr, {
            parseNodeValue : false,
            arrayMode: false,
        });
    } catch (error) {
        throw Error('apack xml parsing error');
    }
}

function getVersionFromApack(xmlStr) {
    const parsedXML = parseXml(xmlStr);
    const versionNode = xmlGetChildrenOf(parsedXML, 'asx:abap/asx:values/DATA/VERSION');
    if (!versionNode || typeof versionNode !== 'string') throw Error('wrong apack xml structure');
    return versionNode;
}

function getDependencyVersionFromApack(xmlStr, depName) {
    if (!depName || typeof depName !== 'string') throw Error('Incorrect dependency name');
    depName = depName.toLowerCase();
    const parsedXML = parseXml(xmlStr);

    // Get deps node
    const data = xmlGetChildrenOf(parsedXML, 'asx:abap/asx:values/DATA');
    if (!data.DEPENDENCIES
        || !data.DEPENDENCIES.item
        || !Array.isArray(data.DEPENDENCIES.item)) throw Error('dependency not found');
    const dependencies = data.DEPENDENCIES.item.filter(i => typeof i === 'object');

    // Find target
    const target = dependencies.find(i => [i.GROUP_ID, i.ARTIFACT_ID].join('/').toLowerCase() === depName);
    if (!target) throw Error('dependency not found');
    if (!target.VERSION) throw Error('dependency version not found');

    return target.VERSION;
}

module.exports = {
    APACK_FILENAME,
    getVersionFromApack,
    getDependencyVersionFromApack,
};
