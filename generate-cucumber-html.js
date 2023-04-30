const reporter = require('cucumber-html-reporter');
const options = require('./cucumber-html-config.json');

reporter.generate(options);
