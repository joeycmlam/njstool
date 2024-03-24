import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import fs from 'fs';
import ExcelReader from '../../../ExcelReader';
import DataTransformer from '../../../DataTransformer';
import path from 'path';

let excelFile: string, jsonOutput: any, expectedJson: any;
let recordName: string, actualJsonData: any;

Given('I have an Excel file {string}', function (givenExcelFile: string) {
  excelFile = givenExcelFile;
});


When('I convert the Excel file to JSON', async function () {
  const fileName = path.join(__dirname, excelFile);
  const excelReader = new ExcelReader();
  const workbook = await excelReader.read(fileName);
  const worksheet = workbook.worksheets[0];
  const dataTransformer = new DataTransformer();
  let {recordName, actualJsonData } = dataTransformer.transform(worksheet, 3);

});

Then('the JSON output should match the expected JSON file {string}', function (expectedJsonFile:string) {
  const fileName: string = path.join(__dirname, expectedJsonFile);
  const expectedJson = JSON.parse(fs.readFileSync(fileName, 'utf8'));
  assert.deepStrictEqual(actualJsonData, expectedJson);
});


