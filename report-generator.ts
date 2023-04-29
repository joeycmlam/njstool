import * as reporter from "cucumber-html-reporter";

const options = {
    theme: "bootstrap",
    jsonFile: "test/cucumber_report.json",
    output: "test/cucumber_report.html",
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: true
};

reporter.generate(options as any);
