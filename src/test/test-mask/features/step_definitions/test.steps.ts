import {Before, Given, Then, When} from '@cucumber/cucumber'
import * as assert from "assert";


let inputData: string;
let actualResult: string;

Before(() => {
    inputData = '';
    actualResult = '';
});


When(/^do the testing "([^"]*)"$/, function (input: string) {
    inputData = input;
});

Given(/^test hello world$/, function () {
    actualResult = inputData;
});


Then('show test {string}', function (expectedResult: string) {
    assert.equal(actualResult, expectedResult);
});


Given(/^input the data (.*)$/, function (input: string) {
    inputData = input;

});

When(/^convert$/, function () {
    actualResult = inputData;
});

Then(/^validate the output (.*)$/, function (expectedResult: string) {

    assert.equal(actualResult, expectedResult);
});


