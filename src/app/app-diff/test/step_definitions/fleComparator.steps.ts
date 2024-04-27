import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import FileComparator from '../../FileComparator';
import i

let fileComparator: FileComparator;
let result = {} as iResult;

Given('I have two files "{string}" and "{string}"', function (file1, file2) {
    fileComparator = new FileComparator(file1, file2);
});

When('I compare the files using FileComparator', function () {
    result = fileComparator.compare();
});

Then('the total number of matching rows should be {int}', function (expectedMatches) {
    assert.strictEqual(result.matches, expectedMatches);
});

Then('the total number of mismatching rows should be {int}', function (expectedMismatches) {
    assert.strictEqual(result.mismatches, expectedMismatches);
});