const {
    parsePathParams,
    validateQueryParams,
} = require('./params');

test('should validate correct params', () => {
    const params = {
        type: 'github',
        owner: 'sbcgua',
        repo: 'repo_name',
        file: 'src/zif.abap',
        attr: 'version_attr',
    };
    const validated = validateQueryParams(params);
    expect(validated).toEqual(params);
});

test('should validate correct params without version', () => {
    const params = {
        type: 'github',
        owner: 'sbcgua',
        repo: 'repo_name',
        file: 'src/zif.abap',
    };
    const validated = validateQueryParams(params);
    expect(validated).toEqual({...params, attr: 'version'});
});

test('should fail on incorrect params', () => {
    expect(() => validateQueryParams({
        // type: 'github',
        owner: 'sbcgua',
        repo: 'repo_name',
        file: 'src/zif.abap',
    })).toThrow('Repository type not specified');
    expect(() => validateQueryParams({
        type: 'github',
        // owner: 'sbcgua',
        repo: 'repo_name',
        file: 'src/zif.abap',
    })).toThrow('Owner');
    expect(() => validateQueryParams({
        type: 'github',
        owner: 'sbcgua',
        // repo: 'repo_name',
        file: 'src/zif.abap',
    })).toThrow('Repository name');
    expect(() => validateQueryParams({
        type: 'github',
        owner: 'sbcgua',
        repo: 'repo_name',
        // file: 'src/zif.abap',
    })).toThrow('Source file');
    expect(() => validateQueryParams({
        type: 'xxx',
        owner: 'sbcgua',
        repo: 'repo_name',
        file: 'src/zif.abap',
    })).toThrow('Repository type not supported');

});

test('should fail on incorrect symbols', () => {
    expect(() => validateQueryParams({
        type: 'github',
        owner: 'sbcgua?',
        repo: 'repo_name',
        file: 'src/zif.abap',
    })).toThrow('[owner] has disallowed symbols');
});

test('should parse correct path', () => {
    expect(parsePathParams({
        pathParameters: {
            sourcePath: 'github/sbcgua/repo_name/src/zif.abap/attr_name'
        },
    })).toEqual({
        type: 'github',
        owner: 'sbcgua',
        repo: 'repo_name',
        file: 'src/zif.abap',
        attr: 'attr_name',
    });
    expect(parsePathParams({
        pathParameters: {
            sourcePath: 'github/sbcgua/repo_name/src/zif.abap'
        },
    })).toEqual({
        type: 'github',
        owner: 'sbcgua',
        repo: 'repo_name',
        file: 'src/zif.abap',
    });
});

test('should throw on incorrect path', () => {
    expect(() => parsePathParams({
        pathParameters: {
            sourcePath: ''
        },
    })).toThrow('Unexpected source path');
    expect(() => parsePathParams({
        pathParameters: {
            sourcePath: 'github/sbcgua/repo_name/src/zif.abap/attr_name/extra'
        },
    })).toThrow('Unexpect path segment');
});
