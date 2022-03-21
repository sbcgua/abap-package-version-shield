// Parser states
const STATE_NORMAL   = 0;
const STATE_IN_CONST = 1;
const STATE_IN_STRUC = 2;

const normalizeVersion = (version) => (/^'\S+'$/.test(version))
    ? version.slice(1,-1)
    : version;

function parseSourceFile(fileData, attrName) {
    const constantValuePattern = `${attrName}\\s+(type\\s+\\S+\\s+)?value\\s+'(?<attrValue>[^']+)'`;
    const reConstValue = new RegExp(constantValuePattern, 'i');
    const reFullConst = new RegExp(`constants:?\\s+${constantValuePattern}`, 'i');
    const reConstDeclOnly = new RegExp('constants:?\\s*($|"|#)', 'i');
    const reBeginOf = new RegExp('begin of\\s+(?<strucName>\\S+)', 'i');
    const reEndOf = new RegExp('end of\\s+(?<strucName>\\S+)', 'i');
    let state = STATE_NORMAL;
    let currentStrucName;

    const rows = fileData.split('\n');
    for (const r of rows) {
        if (!r) continue;              // Ignore empty
        if (r[0] === '*') continue;    // Ignore full line comments
        if (/^\s*"/.test(r)) continue; // Ignore part line comments

        let match;
        match = reFullConst.exec(r);
        if (match && match.groups.attrValue) {
            // considering low end accuracy of the parsing logic let's a found contant rest the state
            state = STATE_NORMAL;
            return normalizeVersion(match.groups.attrValue);
        }
        match = reConstDeclOnly.exec(r);
        if (match) {
            // considering low end accuracy of the parsing logic let's a found contant rest the state
            state = STATE_IN_CONST;
            continue;
        }
        if (state === STATE_IN_CONST) {
            match = reConstValue.exec(r);
            if (match && match.groups.attrValue) {
                return normalizeVersion(match.groups.attrValue);
            }
            match = reBeginOf.exec(r);
            if (match) {
                state = STATE_IN_STRUC;
                currentStrucName = match.groups.strucName;
                continue;
            }
            state = STATE_NORMAL; // Expect "begin of" at the next line after constants
        } else if (state === STATE_IN_STRUC) {
            match = reConstValue.exec(r);
            if (match && match.groups.attrValue) {
                return normalizeVersion(match.groups.attrValue);
            }
            match = reEndOf.exec(r);
            if (match) {
                state = STATE_NORMAL;
                if (currentStrucName !== match.groups.strucName) {
                    console.log(`parseSourceFile: unexpected end of struc ${match.groups.strucName} vs expected ${currentStrucName}`);
                }
                continue;
            }
        }
    }
    throw Error(`Could not find attr ${attrName} in the file`);
}

function validateVersion(version) {
    // Based on official semver spec
    // https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
    const versionRe = /^(v|V)?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
    if (!versionRe.test(version)) throw Error('Unexpected version format');
}

module.exports = {
    validateVersion,
    parseSourceFile,
};
