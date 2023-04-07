import reporter from "cucumber-html-reporter";

const options = {
    theme: "bootstrap",
    jsonFile: "./cucumber_report.json",
    output: "./cucumber_report.html",
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: true
};

reporter.generate(options as any);
