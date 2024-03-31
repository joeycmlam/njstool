module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverageFrom: [
        "src/app/**/*.{ts}",
        "!src/app/**/test/features/step_definitions/*.{ts}",
        "!test/**/**/"
      ]
};
