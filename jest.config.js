module.exports = {
    testMatch: [
        'test/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)',
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    collectCoverage: true,
    coverageDirectory: 'coverage-jest',
    coverageReporters: ['json', 'text-summary'],
};
