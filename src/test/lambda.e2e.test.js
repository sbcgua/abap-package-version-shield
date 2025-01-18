import { expect, test } from 'vitest';
import { pick } from 'lodash-es';

const TARGET = process.env.E2E_TARGET;
const allowedTargets = new Set(['dev', 'qa', 'prod']);
if (!allowedTargets.has(TARGET)) throw Error(`Unexpected E2E_TARGET [${TARGET}]`);

const PREFIX = allowedTargets.has(TARGET)
    ? `${TARGET}-`
    : '';

// const HOST = PREFIX + 'shield.abap.space';
const HOST = 'abap-version-shield.sbcg.com.ua'; // PROD
// TODO dev, maybe remove qa

const functionName = 'version-shield-json';
const versionRe = /^v\d{1,3}\.\d{1,3}(\.\d{1,3})?$/i;
console.log('Target:', TARGET);
console.log('Host:', HOST);

const getUrl = (params) => `https://${HOST}/${functionName}/${params}`;

async function validateExpectations(resp) {
    expect(resp.ok).toBeTruthy();
    const json = await resp.json();
    expect(typeof json).toBe('object');
    expect(pick(json, ['schemaVersion', 'label', 'color'])).toEqual({
        schemaVersion: 1,
        label: 'abap package version',
        color: 'orange'
    });
    expect(typeof json.message).toBe('string');
    expect(json.message).toMatch(versionRe);
}

test('should process abap constant', async () => {
    const resp = await fetch(getUrl('github/sbcgua/mockup_loader/src/zif_mockup_loader.intf.abap'));
    await validateExpectations(resp);
});

test.skip('should process apack', async () => {
    // 2021-08
    // skip because abap-platform-jak sample does not use proper semver (X.Y is not valid, only X.Y.Z)
    // and I didn't find proper stable example in the web, seems APACK does not took off really
    const resp = await fetch(getUrl('github/SAP-samples/abap-platform-jak/.apack-manifest.xml'));
    await validateExpectations(resp);
});

test.skip('should process structured constant and namespaced filename', async () => {
    // 2021-08
    // skip because abap-platform-jak sample does not use proper semver (X.Y is not valid, only X.Y.Z)
    // and I didn't find proper stable example in the web, seems APACK does not took off really
    const resp = await fetch(getUrl('github/Marc-Bernard-Tools/MBT-Base/src/tools/%23mbtools%23cl_tool_bc.clas.abap'));
    await validateExpectations(resp);
});
