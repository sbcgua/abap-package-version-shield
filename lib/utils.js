'use strict';

const https = require('https');

function fetchResource(url) {
    return new Promise((resolve, reject) => {
        let buf = Buffer.from([]);
        const request = https.get(url, res => {
            console.log(`fetch statusCode: ${res.statusCode}`);
            res.on('data', data => {
                buf = Buffer.concat([buf, data]);
            });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(buf.toString());
                } else {
                    reject(`Fetching file failed: [${res.statusCode}] ${buf.toString()}`);
                }
            });
        });
        request.on('error', error => {
            console.error(error);
            reject(error);
        });
    });
}

const enumify = list => Object.freeze(list.reduce((prev, i, index) => Object.assign(prev, { [i]: index }), {}));

function buildResponse(body, code = 200) {
    const response = {
        statusCode: code,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    };
    return response;
}

function xmlGetChildrenOf(xml, path) {
    const segments = path.split('/').filter(i => !!i);
    if (segments.length === 0) throw Error('Unexpected xml drilldown path');
    for (const seg of segments) {
        if (typeof xml !== 'object') throw Error('XML path not found');
        xml = xml[seg];
    }
    return xml;
}

module.exports = {
    xmlGetChildrenOf,
    enumify,
    fetchResource,
    buildResponse,
};
