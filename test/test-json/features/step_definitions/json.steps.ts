import {Given, When, Then} from '@cucumber/cucumber';
import CustomWorld from '../../../support/world';
import * as path from 'path';
import * as assert from 'assert';
import JsonHelper from "../../../../src/app/app-json/jsonHelper";
import excelHelper from "../../../../src/app/lib/excelHelper";


Given('I have a JSON file at {string} {string}', function (this: CustomWorld, datapath: string, fileName: string) {
    this.path = path.dirname(datapath);
    this.jsonFile = fileName;
});

When('I generate the Excel file {string}', async function (this: CustomWorld, actualFile: string) {

    this.actualFile = actualFile;
    const a = new JsonHelper();
    await a.processJsonfile(this.jsonFile);
    await a.write2excel(this.actualFile, 'sheet1');
});

Then('the generated Excel file should match the expected file {string}', async function (this: CustomWorld, expectedFile: string) {
    this.expectedFile = expectedFile;

    const expectedContent = await excelHelper.readWorkbookContent(this.expectedFile);
    const generatedContent = await excelHelper.readWorkbookContent(this.actualFile);

    assert.deepStrictEqual(generatedContent, expectedContent, 'Generated Excel file does not match the expected file');
});