const {
    getVersionFromApack,
    getDependencyVersionFromApack,
} = require('./apack');

const XML_SAMPLE = `
<?xml version="1.0" encoding="utf-8"?>
<asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
 <asx:values>
  <DATA>
   <GROUP_ID>sap.com</GROUP_ID>
   <ARTIFACT_ID>abap-platform-jak</ARTIFACT_ID>
   <VERSION>0.2</VERSION>
   <REPOSITORY_TYPE>abapGit</REPOSITORY_TYPE>
   <GIT_URL>https://github.com/SAP/abap-platform-jak.git</GIT_URL>
   <DEPENDENCIES>
    <item>
     <GROUP_ID>sap.com</GROUP_ID>
     <ARTIFACT_ID>abap-platform-yy</ARTIFACT_ID>
     <VERSION>1.1.0</VERSION>
     <GIT_URL>https://github.com/SAP/abap-platform-yy.git</GIT_URL>
    </item>
    <item>
     <GROUP_ID>sap.com</GROUP_ID>
     <ARTIFACT_ID>abap-platform-XX</ARTIFACT_ID>
     <VERSION>1.2.0</VERSION>
     <GIT_URL>https://github.com/SAP/abap-platform-xx.git</GIT_URL>
    </item>
   </DEPENDENCIES>
  </DATA>
 </asx:values>
</asx:abap>
`;

test('should getVersionFromApack', () => {
    expect(getVersionFromApack(XML_SAMPLE)).toBe('0.2');
});

test('should fail on incorrect XML', () => {
    const malformedXml = XML_SAMPLE.replace('VERSION', 'NOTVERSION');
    expect(() => getVersionFromApack(malformedXml))
        .toThrow('wrong apack xml structure');
});

test('should get version of a dependency', () => {
    expect(getDependencyVersionFromApack(XML_SAMPLE, 'sap.com/abap-platform-xx')).toBe('1.2.0');
});

test('should fail on incorrect XML with dependency', () => {
    const malformedXml = XML_SAMPLE.replace(/VERSION/g, 'NOTVERSION');
    expect(() => getDependencyVersionFromApack(malformedXml, 'sap.com/abap-platform-xx'))
        .toThrow('wrong apack xml structure');
});

test('should fail on missing dependency', () => {
    expect(() => getDependencyVersionFromApack(XML_SAMPLE, 'sap.com/abap-platform-zz'))
        .toThrow('dependency not found');
});

var parser = require('fast-xml-parser');
test.only('should parse XML', () => {
    var jsonObj = parser.parse(XML_SAMPLE, {
        parseNodeValue : false,
        arrayMode: false,
    });
    console.log(JSON.stringify(jsonObj, null, 2));
    var tObj = parser.getTraversalObj(XML_SAMPLE);
    console.log(tObj);
    console.log(tObj.child);
});
