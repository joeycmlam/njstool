module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverageFrom: [
        "src/app/**/*.{ts}",
        "!src/**/**/**/**/",
        "!test/**/**/"
      ]
};
