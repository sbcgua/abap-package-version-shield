const {
    validateVersion,
    parseSourceFile,
} = require('./parse');

test('should parse correct input', () => {
    expect(parseSourceFile([
        'interface zif_mockup_loader_constants.',
        '  constants version type string value \'v2.1.5\'. "#EC NOTEXT',
        'endinterface.',
    ].join('\n'), 'version')).toBe('v2.1.5');

    expect(parseSourceFile([
        'interface zif_mockup_loader_constants.',
        '  constants: version type string value \'v2.1.5\'. "#EC NOTEXT',
        'endinterface.',
    ].join('\n'), 'version')).toBe('v2.1.5');

    expect(parseSourceFile([
        'interface zif_mockup_loader_constants.',
        '  CONSTANTS: version TYPE string VALUE \'v2.1.5\'.',
        'endinterface.',
    ].join('\n'), 'version')).toBe('v2.1.5');

    expect(parseSourceFile([
        'interface zif_mockup_loader_constants.',
        '  CONSTANTS: version VALUE \'v2.1.5\'.',
        'endinterface.',
    ].join('\n'), 'version')).toBe('v2.1.5');
});

test('should parse correct input with multiline constants', () => {
    expect(parseSourceFile([
        'interface zif_mockup_loader_constants.',
        '  CONSTANTS:',
        '    version VALUE \'v2.1.5\'.',
        'endinterface.',
    ].join('\n'), 'version')).toBe('v2.1.5');
});

test('should throw on missing attr', () => {
    expect(() => parseSourceFile([
        'interface zif_mockup_loader_constants.',
        'endinterface.',
    ].join('\n'), 'version')).toThrow('Could not find attr');
});

test('should validate version', () => {
    expect(() => validateVersion('v1.2.3')).not.toThrow();
    expect(() => validateVersion('V1.2.3')).not.toThrow();
    expect(() => validateVersion('1.2.3')).not.toThrow();
    expect(() => validateVersion('v1.2.3.')).toThrow();
});
