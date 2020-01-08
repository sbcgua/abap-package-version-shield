const handler = require('./handler');

jest.mock('https');
const { PassThrough } = require('stream');
const EventEmitter = require('events');
const https = require('https');
https.get.mockImplementation((url, handler) => {
    const resMock = new PassThrough();
    resMock.statusCode = 200;
    handler(resMock);
    if (url === 'https://raw.githubusercontent.com/sbcgua/mockup_loader/master/src/zif_mockup_loader_constants.intf.abap') {
        resMock.write('interface zif_mockup_loader_constants.');
        resMock.write('  constants version type string value \'v2.1.5\'. "#EC NOTEXT');
        resMock.write('endinterface.');
    }
    resMock.end();

    const reqMock = new EventEmitter();
    return reqMock;
});

describe.skip('test with query params', () => {
    test('should work with normal request', async () => {
        const event = {
            queryStringParameters: {
                type: 'github',
                owner: 'sbcgua',
                repo: 'mockup_loader',
                file: 'src/zif_mockup_loader_constants.intf.abap',
                attr: 'version',
            },
        };
        const context = {};

        await expect(handler.getShieldJson(event, context)).resolves.toEqual({
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'v2.1.5',
                schemaVersion: 1,
                label: 'abap package version',
                color: 'orange',
            }),
        });
    });

    test('should fail with wrong request', async () => {
        const event = {
            queryStringParameters: {
                xxx: 'type not specified',
            },
        };
        const context = {};

        global.console = {
            log: jest.fn(),
            error: jest.fn(),
        };

        await expect(handler.getShieldJson(event, context)).resolves.toEqual({
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Repository type not specified',
            }),
        });
        expect(console.error).toBeCalled();
    });
});

describe('test with path', () => {
    test('should work with normal request', async () => {
        const event = {
            resource: '/get-abap-version-shield-json/{sourcePath}',
            path: '/get-abap-version-shield-json/github/sbcgua/mockup_loader/src/zif_mockup_loader_constants.intf.abap/version',
        };
        const context = {};

        await expect(handler.getShieldJson(event, context)).resolves.toEqual({
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'v2.1.5',
                schemaVersion: 1,
                label: 'abap package version',
                color: 'orange',
            }),
        });
    });

    test('should fail with wrong request', async () => {
        const event = {
            resource: '/get-abap-version-shield-json/{sourcePath}',
            path: '/get-abap-version-shield-json/xxx',
        };
        const context = {};

        global.console = {
            log: jest.fn(),
            error: jest.fn(),
        };

        await expect(handler.getShieldJson(event, context)).resolves.toEqual({
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Owner not specified',
            }),
        });
        expect(console.error).toBeCalled();
    });
});
