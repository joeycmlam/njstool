import { Given, When, Then } from '@cucumber/cucumber';
import axios, { AxiosResponse } from 'axios';
import * as assert from 'assert';


let appUrl: string;
let response: AxiosResponse;

Given('the application is running at {string}', async (url: string) => {
    appUrl = url;
});

When('I make a GET request to {string}', async (path: string) => {
    response = await axios.get(`${appUrl}${path}`);
});

Then('the response status code is {string}', (statusCode: string) => {
    assert.equal(response.status, Number(statusCode));
});

Then('the response version is {string}', (version: string) => {
    assert.equal(response.data.version, version);
});
