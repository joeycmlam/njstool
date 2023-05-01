// tests/steps.ts

import { Given, When, Then, BeforeAll, AfterAll } from '@cucumber/cucumber';
import axios, { AxiosResponse } from 'axios';
import * as assert from 'assert';
import { Server } from 'http';
import  { instance } from '../../../../src/app/app-rest/app.rest';

let server: Server;
let appUrl: string;
let response: AxiosResponse;

BeforeAll(async () => {
    const port = process.env.PORT || 3000;
    server = instance.app.listen(port);
    console.log(`Server started on port ${port}`);
});

AfterAll(async () => {
    server.close();
    console.log('Server stopped');
});

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
