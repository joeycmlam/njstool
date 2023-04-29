import * as reporter from "cucumber-html-reporter";

const options = {
    theme: "bootstrap",
    jsonFile: "coverage-cucumber/cucumber-report.json",
    output: "coverage-cucumber/cucumber-coverage-report.html",
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: true
};

reporter.generate(options as any);
