import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { PdfComparator } from '../PdfComparator';


Given('I have a PDF file at "{string}"', function (filePath) {
  // Store the file path in the scenario context
  this.file1 = filePath;
});

Given('I have a PDF file at "{string}"', function (filePath) {
  // Store the file path in the scenario context
  this.file2 = filePath;
});

When('I compare the two files', async function () {
  // Use the file paths stored in the scenario context
  const test = new PdfComparator();
  this.result = await test.comparePdfFiles(this.file1, this.file2);
});

Then('the result should be "{string}"', function (expectedResult) {
  expect(this.result).to.equal(expectedResult);
});