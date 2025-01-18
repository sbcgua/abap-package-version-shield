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

test('should get version of a dependency where there is one dependency', () => {
    const XML_SAMPLE = `
    <?xml version="1.0" encoding="utf-8"?>
    <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
     <asx:values>
      <DATA>
       <DEPENDENCIES>
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
    expect(getDependencyVersionFromApack(XML_SAMPLE, 'sap.com/abap-platform-xx')).toBe('1.2.0');
});

test('should fail on dependency without version', () => {
    const malformedXml = XML_SAMPLE.replace(/VERSION/g, 'NOTVERSION');
    expect(() => getDependencyVersionFromApack(malformedXml, 'sap.com/abap-platform-xx'))
        .toThrow('dependency version not found');
});

test('should fail on missing dependency', () => {
    expect(() => getDependencyVersionFromApack(XML_SAMPLE, 'sap.com/abap-platform-zz'))
        .toThrow('dependency not found');
});

test('should fail on missing dependencies node', () => {
    expect(() => getDependencyVersionFromApack(`
        <?xml version="1.0" encoding="utf-8"?>
        <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
            <asx:values>
                <DATA>
                    <GROUP_ID>sap.com</GROUP_ID>
                    <ARTIFACT_ID>abap-platform-jak</ARTIFACT_ID>
                    <VERSION>0.2</VERSION>
                    <REPOSITORY_TYPE>abapGit</REPOSITORY_TYPE>
                    <GIT_URL>https://github.com/SAP/abap-platform-jak.git</GIT_URL>
                </DATA>
            </asx:values>
        </asx:abap>
        `, 'sap.com/abap-platform-zz'))
        .toThrow('dependency not found');
});
