import {Before, Given, Then, When} from '@cucumber/cucumber'
import * as assert from "assert";
import {DataMask} from "../../src/data-mask";
import * as fs from 'fs';


let inputData: any;
let actualResult: any;
let expectedResult: any;
const dataMask = new DataMask;

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

    return fs.readFileSync(fileName, 'utf8');
}

When(/^convert msg from file$/, function () {
    const inputOjbect = JSON.parse(readFileAsJson(inputData));
    actualResult = dataMask.mask(inputOjbect);
});

Then(/^validate the out "([^"]*)"$/, function (expectedFile: string) {
    const expectedValue = JSON.parse(readFileAsJson(expectedFile));
    assert.deepStrictEqual(actualResult, expectedValue);
});
Given(/^provide object$/, function () {
    inputData = {
        "password": "my-x112345",
        "passphrase": "Tiger123",
        "secret": "2ahUKEwjL_rLSypr-AhUyrlYBHViSCZ0Qpyp6BAgFEAA",
        "accessToken": "/setprefs?hl=en&prev=https://www.google.com/search?q%3Dtoken%2Bpattern%2Band%2Blexeme%26rlz%3D1C5GCEA_enHK854HK854%26oq%3Dtoken%2Bpattern%26aqs%3Dchrome.0.0i512j69i57j0i512j0i22i30l2j0i15i22i30l2j0i22i30l3.11177j0j7%26sourceid%3Dchrome%26ie%3DUTF-8%26pccc%3D1&sig=0_u6eICvortHxmZq8O90XESUmYPd8%3D&cs=1"
    }
    expectedResult = {
        "password": "*****",
        "passphrase": "*****",
        "secret": "*****",
        "accessToken": "*****"
    };
});
When(/^convert object$/, function () {
    actualResult = dataMask.mask(inputData);
});
Then(/^the data should be masked$/, function () {

    assert.deepStrictEqual(actualResult, expectedResult);
});
Given(/^provide array of object$/, function () {
    inputData = [
        {
            "full name": "Doris Tillman",
            "address": {
                "street": "4152 Doyle Inlet",
                "city": "Ramnagar"
            },
            "email": "Doris.Tillman@hotmail.com"
        },
        {
            "full name": "Miriam Quitzon",
            "address": {
                "street": "528 Esta Key",
                "city": "Lambayeque"
            },
            "email": "Miriam30@hotmail.com"
        }];
    expectedResult = [
        {
            "full name": "Doris Tillman",
            "address": {
                "street": "4152 Doyle Inlet",
                "city": "Ramnagar"
            },
            "email": "*****"
        },
        {
            "full name": "Miriam Quitzon",
            "address": {
                "street": "528 Esta Key",
                "city": "Lambayeque"
            },
            "email": "*****"
        }];
});
