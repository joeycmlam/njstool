export const PATTERN_PWS = {
    pattern_1: /password \s*(\S+)/,
    pattern_2: /password: \s*(\S+)/,
    pattern_3/**/: /pass: \s*(\S+)/
};

export const PATTERN_PWS_REPLACE = {
    pattern_1: 'password: ******',
    pattern_2: 'pass: ******',
    pattern_3: 'password ******'
}
