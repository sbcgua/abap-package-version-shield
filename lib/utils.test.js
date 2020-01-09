const {
    enumify,
    buildResponse,
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

