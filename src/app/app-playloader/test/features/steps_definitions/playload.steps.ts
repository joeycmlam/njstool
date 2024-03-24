const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const fs = require('fs');
const ExcelToJsonConverter = require('../../app-playload/ExcelToJsonConverter');

let excelFile: string, jsonOutput: any, expectedJson: any;

Given('I have an Excel file "{string}"', function (givenExcelFile: string) {
  excelFile = givenExcelFile;
});

When('I convert the Excel file to JSON', function () {
  const converter = new ExcelToJsonConverter();
  jsonOutput = converter.convert(excelFile);
});

Then('the JSON output should match the expected JSON file "{string}"', function (expectedJsonFile:string) {
  expectedJson = JSON.parse(fs.readFileSync(expectedJsonFile, 'utf8'));
  assert.deepStrictEqual(jsonOutput, expectedJson);
});