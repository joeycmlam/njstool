import { Given, When, Then, After, Before } from '@cucumber/cucumber';
import axios, { AxiosResponse } from 'axios';
import * as assert from 'assert';
import { Server } from 'http';
import { instance } from '../../../../app/app-rest/app.rest';
import FileHelper from "../../../../app/lib/fileHelper";
import * as path from "path";

let datapath: string;
let server: Server;
let appUrl: string;
let response: AxiosResponse;

Before("@restFeature", async () => {
    datapath = 'test/test-rest/features/test_data';
    const port = process.env.PORT || 3000;
    server = instance.app.listen(port);
    console.log(`Server started on port ${port}`);
});

After("@restFeature", async () => {
    server.close();
    console.log('Server stopped');
});

Given('the application is running at {string}', async (url: string) => {
    appUrl = url;
});

When('I make a GET request to {string}', async (uri: string) => {
    response = await axios.get(`${appUrl}${uri}`);
});

Then('the response status code is {string}', (statusCode: string) => {
    assert.equal(response.status, Number(statusCode));
});

Then('the response version is {string}', (version: string) => {
    assert.equal(response.data.version, version);
});
When('I make a GET request to {string} {string}', async (uri: string, filename: string) => {
    response = await axios.get(`${appUrl}${uri}/${filename}`);
});

Then('the response body is {string}', async (outputFilename: string) => {
    const fullfilename: string = path.join (datapath, outputFilename);
    const expectedOutput = await FileHelper.readFile(fullfilename);
    assert.deepEqual(response.data.body, expectedOutput);
});
