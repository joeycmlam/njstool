import {Given, When, Then} from '@cucumber/cucumber';
import {CustomWorld} from '../../../support/world';
import * as path from 'path';
import * as assert from 'assert';
import JsonHelper from "../../../../app/app-json/jsonHelper";
import excelHelper from "../../../../app/lib/excelHelper";

const config = {
    "dataPath": "/Users/joeylam/repo/njs/njstool/test/test-json/data",
    "outputPath": "/Users/joeylam/repo/njs/njstool/test/test-json/output",
    "expectedPath": "/Users/joeylam/repo/njs/njstool/test/test-json/features/expected"
};

let jsonFileName: string;
let actualFileName: string;
let expectedFileName: string;

Given('I have a JSON file at {string} {string}', function (datapath: string, fileName: string) {
    // this.dataPath = config.dataPath;
    jsonFileName = path.join(config.dataPath, fileName);
});

When('I generate the Excel file {string}', async function (actualFile: string) {

    actualFileName = path.join(config.outputPath, actualFile);
    console.log('actualFile: ', actualFileName);
    const a: JsonHelper = new JsonHelper();
    await a.processJsonfile(jsonFileName);
    await a.write2excel(actualFileName, 'sheet1');
});

Then('the generated Excel file should match the expected file {string}', async function (expectedFile: string) {
    const expectedFileName = path.join(this.dataPath, expectedFile);
    const expectedContent = await excelHelper.readWorkbookContent(expectedFileName, 'sheet1');
    const generatedContent = await excelHelper.readWorkbookContent(actualFileName, 'sheet1');

    assert.deepStrictEqual(generatedContent, expectedContent, 'Generated Excel file does not match the expected file');
});
