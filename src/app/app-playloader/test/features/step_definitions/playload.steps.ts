import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import DataTransformer from '../../../DataTransformer';
import ExcelReader from '../../../ExcelReader';

let excelFile: string;
let actualResult: any;
let config = {
  "source": {
      "inputPath": "/Users/joeylam/repo/njs/njstool/src/app/app-playloader/data",
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
      "path": "/Users/joeylam/repo/njs/njstool/src/app/app-playloader/test/expected"
  }    
}

Given('I have an Excel file {string}', function (givenExcelFile: string) {
  excelFile = givenExcelFile;
});


When('I convert the Excel file to JSON', async function () {
  const fileName = path.join(config.source.inputPath, excelFile);
  const excelReader = new ExcelReader();
  const workbook = await excelReader.read(fileName);
  const worksheet = workbook.worksheets[0];
  const dataTransformer = new DataTransformer();
  actualResult = await dataTransformer.transform(worksheet, config.dataformat.dataStartCol, config.dataformat);
});

Then('the JSON output should match the expected JSON file {string}', function (expectedJsonFile:string) {
  const fileName: string = path.join(config.expected.path, expectedJsonFile);
  const expectedJson = JSON.parse(fs.readFileSync(fileName, 'utf8'));
  console.log('actualResult', JSON.stringify(actualResult));
  assert.deepStrictEqual(actualResult.jsonData, expectedJson);
});


