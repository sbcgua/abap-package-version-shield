const {
    validateVersion,
    parseSourceFile,
} = require('./parse');

test('should parse correct input', () => {
    expect(parseSourceFile([
        'interface zif_mockup_loader.',
        '  constants version type string value \'v2.1.5\'. "#EC NOTEXT',
        'endinterface.',
    ].join('\n'), 'version')).toBe('v2.1.5');

    expect(parseSourceFile([
        'interface zif_mockup_loader.',
        '  constants: version type string value \'v2.1.5\'. "#EC NOTEXT',
        'endinterface.',
    ].join('\n'), 'version')).toBe('v2.1.5');

    expect(parseSourceFile([
        'interface zif_mockup_loader.',
        '  constants: version type string value \'v2.1.5\' ##NO_TEXT.',
        'endinterface.',
    ].join('\n'), 'version')).toBe('v2.1.5');

    expect(parseSourceFile([
        'interface zif_mockup_loader.',
        '  CONSTANTS: version TYPE string VALUE \'v2.1.5\'.',
        'endinterface.',
    ].join('\n'), 'version')).toBe('v2.1.5');

    expect(parseSourceFile([
        'interface zif_mockup_loader.',
        '  CONSTANTS: version VALUE \'v2.1.5\'.',
        'endinterface.',
    ].join('\n'), 'version')).toBe('v2.1.5');
});

test('should parse correct input with multiline constants', () => {
    expect(parseSourceFile([
        'interface zif_mockup_loader.',
        '  CONSTANTS:',
        '    version VALUE \'v2.1.5\'.',
        'endinterface.',
    ].join('\n'), 'version')).toBe('v2.1.5');
    expect(parseSourceFile([
        'interface zif_mockup_loader.',
        '  CONSTANTS',
        '    version VALUE \'v2.1.5\'.',
        'endinterface.',
    ].join('\n'), 'version')).toBe('v2.1.5');
});

test('should parse structured constant', () => {
    expect(parseSourceFile([
        'interface zif_mockup_loader.',
        '  CONSTANTS:',
        '    begin of c_something,',
        '      other VALUE \'xyz\',',
        '      version VALUE \'v2.1.5\',',
        '    end of c_something.',
        'endinterface.',
    ].join('\n'), 'version')).toBe('v2.1.5');
});

test('should throw on missing attr', () => {
    expect(() => parseSourceFile([
        'interface zif_mockup_loader.',
        'endinterface.',
    ].join('\n'), 'version')).toThrow('Could not find attr');
});

test('should throw on missing attr with tricky structures', () => {
    expect(() => parseSourceFile([
        'interface zif_mockup_loader.',
        '  CONSTANTS:',
        '    someconst VALUE \'v2.1.5\'.',
        '  data:',
        '    begin of c_something,',
        '      version VALUE \'v2.1.5\',',
        '    end of c_something.',
        'endinterface.',
    ].join('\n'), 'version')).toThrow('Could not find attr');
});

test('should validate version', () => {
    expect(() => validateVersion('v1.2.3')).not.toThrow();
    expect(() => validateVersion('V1.2.3')).not.toThrow();
    expect(() => validateVersion('1.2.3')).not.toThrow();
    expect(() => validateVersion('v1.2.3.')).toThrow();
});

test('should validate version with suffix', () => {
    expect(() => validateVersion('v1.2.3-pre')).not.toThrow();
    expect(() => validateVersion('v1.2.3-alpha')).not.toThrow();
    expect(() => validateVersion('v1.2.3_xyz')).toThrow();
    expect(() => validateVersion('v1.2.3xyz')).toThrow();
});
