import { Given, When, Then } from '@cucumber/cucumber';
import { ETLProcesser, FileProcessorConfig } from "../../../etlProcesser";
import { AppEtlConfig } from "../../../appEtlConfig";
import ExcelReader from "../../../../lib/excelReader";
import assert from 'assert';
import { ConfigHelper } from '../../../../lib/configHelper';
import { accountConfig } from "../../../accountConfig";
import { holdingConfig } from "../../../holdingConfig";
import DBConnection from '../../../../lib/dbConnection';
import DatabaseConfig from '../../../../lib/configDatabase';
import path from 'path';

let datProcessor: ETLProcesser;
let actualStatus: number;
let actualTotalRecord: number;
let testConfig = { "dataPath": 'data', "configPath": '../../../'}

Given('the interface file {string} and {string}', async function (dataFile: string, tableName: string) {
  const configFile = path.join(__dirname, testConfig.configPath, 'config.etl.yaml');
  const dataConfigFile = path.join(__dirname, testConfig.configPath, 'config.db.yaml');
  const configHelper = new ConfigHelper(configFile);
  await configHelper.load();
  // const appConfig = configHelper.getConfig() as AppEtlConfig;

  const dbConfigHelper = new ConfigHelper(dataConfigFile);
  await dbConfigHelper.load();
  const dbConfig = dbConfigHelper.getConfig() as DatabaseConfig;

  // Initialize EtlProcessor with the data file

  const dataReader = new ExcelReader(dataFile);
  const dataUploader = new DBConnection(dbConfig);

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
  await datProcessor.process();
});

Then('call eltProcesser.ts to load the data into database and expect the job is {int} and number of record {int}', function (expectedStatus: number, expectedTotalRecord: number) {
  // Get the actual status and total record from EtlProcessor
  actualStatus = datProcessor.getStatus();
  actualTotalRecord = datProcessor.getTotalRecord();

  // Assert that the actual status and total record match the expected values
  assert.strictEqual(actualStatus, expectedStatus);
  assert.strictEqual(actualTotalRecord, expectedTotalRecord);
});