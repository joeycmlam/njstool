const tsNode = require("ts-node");

tsNode.register({
    transpileOnly: true,
    project: "tsconfig.json",
});

const config = [
    '--require-module ts-node/register/transpile-only',
    '--require source-map-support/register',
    '--require test/**/features/step_definitions/*.steps.ts '
].join(' ');

module.exports = {
    default: config
};

