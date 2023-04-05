import {Before, Given, Then, When} from '@cucumber/cucumber'
import * as assert from "assert";
import { DataMasker} from "../../dataMasker";

let inputData: string
let actualResult: string;

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
