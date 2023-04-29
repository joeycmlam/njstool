import {Given, When, Then} from '@cucumber/cucumber';
import CustomWorld from '../../../support/world';
import * as fs from 'fs';
import * as path from 'path';
import * as assert from 'assert';
import JsonHelper from "../../../../src/app/app-json/jsonHelper";


Given('I have a JSON file at {string}', function (this: CustomWorld,  fileName: string) {
    this.jsonFile = path.dirname(fileName);
});

When('I generate the Excel file {string}', async function (this: CustomWorld, actualFile: string) {

    this.actualFile = actualFile;
    const a = new JsonHelper();
    await a.processJsonfile(this.jsonFile);
    await a.write2excel(this.actualFile , 'sheet1');
});

Then('the generated Excel file should match the expected file {string}', function (this: CustomWorld, expectedFile: string) {
    this.expectedFile = expectedFile;

    const generatedContent = fs.readFileSync(this.actualFile);
    const expectedContent = fs.readFileSync(this.expectedFile);
    assert.deepStrictEqual(generatedContent, expectedContent, 'Generated Excel file does not match the expected file');
});
