import {Before, Given, Then, When} from '@cucumber/cucumber'
import * as assert from "assert";
import {DataMasker} from "../../src/dataMasker";
import * as fs from 'fs';

let inputData: any;
let actualResult: any;

Before(() => {
    inputData = '';
    actualResult = '';
});

Given(/^provide the a string "([^"]*)"$/, function (input: string) {
    inputData = input;
});

When(/^I mask the data$/, function () {
    actualResult = DataMasker.datamask(inputData);
});

Then(/^output is "([^"]*)"$/, function (expectedResult: string) {
    assert.equal(actualResult, expectedResult);
});


Given(/^provide json file "([^"]*)"$/, function (input: string) {
    inputData = input;
});

function readFileAsJson(fileName: string): any {
    const fileContent = fs.readFileSync(fileName, 'utf8');
    return JSON.parse(fileContent);
}

Then(/^validate the out "([^"]*)"$/, function (expectedFile: string) {
    actualResult = JSON.stringify(readFileAsJson(inputData));
    const expectedResult = JSON.stringify(readFileAsJson(expectedFile));
    assert.equal(actualResult, expectedResult);


});
