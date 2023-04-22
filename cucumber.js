const tsNode = require("ts-node");

tsNode.register({
    transpileOnly: true,
    project: "tsconfig.json",
});

module.exports = {
    default: '--format json:cucumber_report.json --publish-quiet --require-module ts-node/register/transpile-only --require test/features/step_definitions/*.steps.ts ',

};

