import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import DataTransformer from '../../../DataTransformer';
import ExcelReader from '../../../ExcelReader';

let excelFile: string;
let actualResult: any;
let config  = {
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

Given('I have an Excel file {string}', function (givenExcelFile: string) {
  const folderPath = path.join(__dirname, config.source.inputPath);
  excelFile = path.join(folderPath, givenExcelFile);
});


When('I convert the Excel file to JSON', async function () {

  const excelReader = new ExcelReader();
  const workbook = await excelReader.read(excelFile);
  const worksheet = workbook.worksheets[0];
  const dataTransformer = new DataTransformer();
  actualResult = await dataTransformer.transform(worksheet, config.dataformat.dataStartCol, config.dataformat);
});

Then('the JSON output should match the expected JSON file {string}', function (expectedJsonFile:string) {
  const outfolderPath = path.join(__dirname, config.expected.path);
  const fileName: string = path.join(outfolderPath, expectedJsonFile);
  const expectedJson = JSON.parse(fs.readFileSync(fileName, 'utf8'));
  assert.deepStrictEqual(actualResult.jsonData, expectedJson);
});


