
const fs = require('fs');
const path = require('path');
const { createCoverageMap } = require('istanbul-lib-coverage');
const { createReporter } = require('istanbul-api');

const coverageJestDir = path.join(__dirname, 'coverage-jest');
const coverageCucumberDir = path.join(__dirname, 'coverage-cucumber');

const coverageMap = createCoverageMap();

const loadCoverageData = (coverageDir) => {
    const coverageFile = path.join(coverageDir, 'coverage-final.json');
    return JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
};

const mergeCoverageData = (coverageData) => {
    coverageMap.merge(coverageData);
};

const generateReports = () => {
    const reporter = createReporter();
    reporter.addAll(['html', 'json', 'text-summary']);
    reporter.write(coverageMap);
};

const jestCoverageData = loadCoverageData(coverageJestDir);
const cucumberCoverageData = loadCoverageData(coverageCucumberDir);

mergeCoverageData(jestCoverageData);
mergeCoverageData(cucumberCoverageData);
generateReports();
