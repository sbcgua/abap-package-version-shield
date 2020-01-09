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

test('should xmlGetChildrenOf', () => {
    const xml = [
        {
            type: 'element',
            tagName: '?xml',
        },
        {
            type: 'element',
            tagName: 'DATA',
            childNodes: [
                {
                    type: 'text',
                    text: 'blah blah',
                },
                {
                    type: 'element',
                    tagName: 'VERSION',
                    childNodes: [
                        {
                            type: 'text',
                            text: 'target',
                        },
                    ],
                },
            ],
        },
    ];
    expect(xmlGetChildrenOf(xml, 'DATA/VERSION')).toEqual([
        {
            type: 'text',
            text: 'target',
        },
    ]);
    expect(xmlGetChildrenOf(xml, 'DATA/OTHER')).toBeUndefined();
});
