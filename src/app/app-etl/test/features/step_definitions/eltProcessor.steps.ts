import * as fs from 'fs';
import path from "path";
import { Given, When, Then } from '@cucumber/cucumber';
import { ETLProcesser, FileProcessorConfig } from "../../../etlProcesser";
import ExcelReader from "../../../../lib/excelReader";
import assert from 'assert';
import { ConfigHelper } from '../../../../lib/configHelper';
import { accountConfig } from "../../../accountConfig";
import { holdingConfig } from "../../../holdingConfig";
import DBConnection from '../../../../lib/dbConnection';
import DatabaseConfig from '../../../../lib/configDatabase';

let datProcessor: ETLProcesser;
let actualStatus: number;
let actualTotalRecord: number;
let testConfig = { "dataPath": '../../data', "configPath": '../../../'}

Given('the interface file {string} and {string}', async function (dataFile: string, tableName: string) {

  const configFile = path.join(__dirname, '../../../config.json');
  const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));

  require('dotenv').config({ path: config.envFile });
  config.database.host = process.env.DB_HOST;
  config.database.port = process.env.DB_PORT;
  config.database.database = process.env.DB_NAME;
  config.database.user = process.env.DB_USER;
  config.database.password = process.env.DB_PASSWORD;


  // Initialize EtlProcessor with the data file
  const dataFullFileName = path.join(__dirname, testConfig.dataPath, dataFile);
  const dataReader = new ExcelReader(dataFullFileName);
  const dataUploader = new DBConnection(config.database);

  let dataConfig: FileProcessorConfig;
  switch (tableName) {
    case 'account':
      dataConfig = accountConfig;
      break;
    case 'holding':
      dataConfig = holdingConfig;
      break;
    default:
      return;
  }
  dataConfig.fileName = path.join(__dirname, testConfig.dataPath, dataFile);

  datProcessor = new ETLProcesser(dataConfig, dataUploader, dataReader);

});

When('file arrive', async function () {
  // Process the file
  try {
   
    await datProcessor.process();
  } catch (error) {
    console.log(error);
  }

});

Then('call eltProcesser.ts to load the data into database and expect the job is {int} and number of record {int}', function (expectedStatus: number, expectedTotalRecord: number) {
  // Get the actual status and total record from EtlProcessor
  actualStatus = datProcessor.getStatus();
  actualTotalRecord = datProcessor.getTotalRecord();

  // Assert that the actual status and total record match the expected values
  assert.strictEqual(actualStatus, expectedStatus);
  assert.strictEqual(actualTotalRecord, expectedTotalRecord);
});