import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import DataTransformer from '../../../DataTransformer';
import ExcelReader from '../../../ExcelReader';

let excelFile: string;
let actualResult: any;

Given('I have an Excel file {string}', function (givenExcelFile: string) {
  excelFile = givenExcelFile;
});


When('I convert the Excel file to JSON', async function () {
  const fileName = path.join(__dirname, excelFile);
  const excelReader = new ExcelReader();
  const workbook = await excelReader.read(fileName);
  const worksheet = workbook.worksheets[0];
  const dataTransformer = new DataTransformer();
  actualResult = await dataTransformer.transform(worksheet, 3);
});

Then('the JSON output should match the expected JSON file {string}', function (expectedJsonFile:string) {
  const fileName: string = path.join(__dirname, expectedJsonFile);
  const expectedJson = JSON.parse(fs.readFileSync(fileName, 'utf8'));
  console.log('actualResult', JSON.stringify(actualResult));
  assert.deepStrictEqual(actualResult.jsonData, expectedJson);
});


