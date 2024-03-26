# njstool

---------------------------------
HOW TO USE IT

import Logger from './logwinston';
const logger = new Logger();

it is very handy to use https://mockturtle.net to generate the json test case


---------------------------------
HOW TO RUN TEST

npm run test:jest       ==> run *.test.js for unit test
npm run test:cucumber   ==> run features/*.steps.ts for feature test with line of code coverage by using nyc
npm run merge-reports   ==> merge jest and cucumber line of code coverage
npm run generate-cucumber-html  ==> generate cucumber features test report in html format


---------------------------------
HOW TO BUILD

> npm run build
> npm install -g pkg
> pkg -t node14-win-x64,node14-macos-x64 .