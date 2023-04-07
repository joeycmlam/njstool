import {Before, Given, Then, When} from '@cucumber/cucumber'
import * as assert from "assert";
import {dataMask} from "../../src/data-mask";
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
    actualResult = dataMask.mask(inputData);
});

Then(/^output is "([^"]*)"$/, function (expectedResult: string) {
    assert.equal(actualResult, expectedResult);
});


Given(/^provide json file "([^"]*)"$/, function (input: string) {
    inputData = input;
});

function readFileAsJson(fileName: string): any {
    const fileContent = fs.readFileSync(fileName, 'utf8');
    return fileContent;
}

When(/^convert msg from file$/, function () {
    actualResult = dataMask.mask(readFileAsJson(inputData));
});

Then(/^validate the out "([^"]*)"$/, function (expectedFile: string) {
    const expectedValue = readFileAsJson(expectedFile);
    assert.equal(actualResult, expectedValue);


});
