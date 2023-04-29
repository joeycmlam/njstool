const tsNode = require("ts-node");

tsNode.register({
    transpileOnly: true,
    project: "tsconfig.json",
});

const config = [
    '--format json:cucumber_report.json',
    '--publish-quiet --require-module ts-node/register/transpile-only',
    '--require test/**/features/step_definitions/*.steps.ts '
].join(' ');

module.exports = {
    default: config
};

