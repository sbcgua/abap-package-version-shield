const xml = require('xml-parse');
const APACK_FILENAME = '.apack-manifest.xml';
const { xmlGetChildrenOf } = require('./utils');

function parseXml(xmlStr) {
    try {
        return xml.parse(xmlStr);
    } catch (error) {
        throw Error('apack xml parsing error');
    }
}

function getVersionFromApack(xmlStr) {
    const parsedXML = parseXml(xmlStr);
    const versionNodeChildren = xmlGetChildrenOf(parsedXML, 'DATA/VERSION');
    if (!versionNodeChildren) throw Error('wrong apack xml structure');
    const versionText = versionNodeChildren.find(node => node.type === 'text');
    if (!versionText) throw Error('wrong apack xml structure');
    return versionText.text;
}

function xmlElemToDependency(xmlElem) {
    if (!xmlElem.childNodes) throw Error('incorrect dependency element');
    console.log(xmlElem.childNodes);

    const expectedTags = new Set(['GROUP_ID', 'ARTIFACT_ID', 'VERSION', 'GIT_URL']);
    const tags = xmlElem.childNodes
        .filter(n => n.type === 'element' && expectedTags.has(n.tagName) )
        .map(n => [n.tagName, n]);
    const depDescription = {};
    for (let [tag, value] of tags) depDescription[tag] = value;
    return depDescription;
}

function getDependencyVersionFromApack(xmlStr, depName) {
    const parsedXML = parseXml(xmlStr);

    // Get deps node
    let dependencies = xmlGetChildrenOf(parsedXML, 'DATA/DEPENDENCIES');
    if (!dependencies) throw Error('dependency not found');

    // only elements, remove texts
    dependencies = dependencies.filter(n => n.type === 'element');
    if (!dependencies) throw Error('dependency not found');

    dependencies = dependencies.map(xmlElemToDependency);
    console.log(dependencies);


    // if (!versionNodeChildren) throw Error('wrong apack xml structure');
    // const versionText = versionNodeChildren.find(node => node.type === 'text');
    // if (!versionText) throw Error('wrong apack xml structure');
    return versionText.text;
}

module.exports = {
    APACK_FILENAME,
    getVersionFromApack,
    getDependencyVersionFromApack,
};
