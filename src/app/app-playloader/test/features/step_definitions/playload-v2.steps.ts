import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import DataTransformer from '../../../DataTransformerv2';
import excelHelper from '../../../../lib/excelHelper';

let excelFile: string;
let actualResult: any;
let config: any;
let testConfig = {
  "config": { "path": "../../../config" },
  "source": {
    "inputPath": "../../../data",
    "inputFile": "sample.xlsx"
  },
  "dataformat": {
    "sheetName": "Sheet1",
    "startRow": 1,
    "fieldCol": 1,
    "typeCol": 2,
    "dataStartCol": 3,
    "dataEndCol": 4
  },
  "expected": {
    "path": "../../../test/expected"
  }
};

Given('v2-I have an Excel file {string} and {string}', function (givenExcelFile: string, configFile: string) {
  const folderPath = path.join(__dirname, testConfig.source.inputPath);
  excelFile = path.join(folderPath, givenExcelFile);
  const configPath = path.join(__dirname, testConfig.config.path);
  config = JSON.parse(fs.readFileSync(path.join(configPath, configFile), 'utf8'));
});


When('v2-I convert the Excel file to JSON', async function () {

  const excelReader = new excelHelper();
  const workbook = await excelReader.read(excelFile);
  const worksheet = workbook.worksheets[0];
  const dataTransformer = new DataTransformer();
  actualResult = await dataTransformer.transform(worksheet, config.dataformat.dataStartCol, config.dataformat);
});

Then('v2-the JSON output should match the expected JSON file {string}', function (expectedJsonFile: string) {
  const outfolderPath = path.join(__dirname, testConfig.expected.path);
  const fileName: string = path.join(outfolderPath, expectedJsonFile);
  const expectedJson = JSON.parse(fs.readFileSync(fileName, 'utf8'));

  // Fields to exclude
  const excludeFields = ['intructionDateTime'];

  // Create copies of the actual and expected objects
  const actualCopy = actualResult.jsonData;
  const expectedCopy = expectedJson;


  // Delete the fields to exclude from the copies
  excludeFields.forEach(field => {
    delete actualCopy[field];
    delete expectedCopy[field];
  });


  // Compare the copies
  assert.deepStrictEqual(actualCopy, expectedCopy);
  // assert.deepStrictEqual(actualResult.jsonData, expectedJson);
});

