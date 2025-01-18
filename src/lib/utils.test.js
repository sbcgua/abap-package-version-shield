const {
    enumify,
    buildResponse,
    xmlGetChildrenOf,
} = require('./utils');

test('should enumify', () => {
    expect(enumify(['A','B','C'])).toEqual({
        A: 0,
        B: 1,
        C: 2,
    });
});

test('should buildResponse', () => {
    expect(buildResponse({ A: 1 })).toEqual({
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        body: '{\"A\":1}', // eslint-disable-line no-useless-escape
    });
    expect(buildResponse({ A: 1 }, 400)).toEqual({
        statusCode: 400,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        body: '{\"A\":1}', // eslint-disable-line no-useless-escape
    });
});

test('should xmlGetChildrenOf new', () => {
    const xml = {
        'asx:abap': {
            'asx:values': {
                'DATA': {
                    'GROUP_ID': 'sap.com',
                    'ARTIFACT_ID': 'abap-platform-jak',
                    'VERSION': '0.2',
                    'REPOSITORY_TYPE': 'abapGit',
                    'GIT_URL': 'https://github.com/SAP/abap-platform-jak.git',
                    'DEPENDENCIES': {
                        'item': [
                            {
                                'GROUP_ID': 'sap.com',
                                'ARTIFACT_ID': 'abap-platform-yy',
                                'VERSION': '1.1.0',
                                'GIT_URL': 'https://github.com/SAP/abap-platform-yy.git'
                            },
                            {
                                'GROUP_ID': 'sap.com',
                                'ARTIFACT_ID': 'abap-platform-XX',
                                'VERSION': '1.2.0',
                                'GIT_URL': 'https://github.com/SAP/abap-platform-xx.git'
                            }
                        ]
                    }
                }
            }
        }
    };
    expect(xmlGetChildrenOf(xml, 'asx:abap/asx:values/DATA/VERSION')).toEqual('0.2');
    expect(xmlGetChildrenOf(xml, 'asx:abap/asx:values/DATA/DEPENDENCIES/item')).toEqual([
        {
            'GROUP_ID': 'sap.com',
            'ARTIFACT_ID': 'abap-platform-yy',
            'VERSION': '1.1.0',
            'GIT_URL': 'https://github.com/SAP/abap-platform-yy.git'
        },
        {
            'GROUP_ID': 'sap.com',
            'ARTIFACT_ID': 'abap-platform-XX',
            'VERSION': '1.2.0',
            'GIT_URL': 'https://github.com/SAP/abap-platform-xx.git'
        }
    ]);
    expect(() => xmlGetChildrenOf(xml, 'DATA/OTHER')).toThrow('XML path not found');
    expect(() => xmlGetChildrenOf(xml, '')).toThrow('Unexpected xml drilldown path');
});
