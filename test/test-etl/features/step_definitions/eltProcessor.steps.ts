import { Given, When, Then } from '@cucumber/cucumber';
import { ETLProcesser, FileProcessorConfig } from "../../../../src/app/app-etl/etlProcesser";
import { AppEtlConfig } from "../../../../src/app/app-etl/appEtlConfig";
import ExcelReader from "../../../../src/app/lib/excelReader";
import assert from 'assert';
import { ConfigHelper } from '../../../../src/app/lib/configHelper';
import { accountConfig } from "../../../../src/app/app-etl/accountConfig";
import { holdingConfig } from "../../../../src/app/app-etl/holdingConfig";
import DBConnection from '../../../../src/app/lib/dbConnection';
import DatabaseConfig from '../../../../src/app/lib/configDatabase';

let datProcessor: ETLProcesser;
let actualStatus: number;
let actualTotalRecord: number;

Given('the interface file {string} and {string}', async function (dataFile: string, tableName: string) {
  const configFile = 'src/app/app-etl/config.etl.yaml';
  const dataConfigFile = 'src/app/app-etl/config.database.yaml';
  const configHelper = new ConfigHelper(configFile);
  await configHelper.load();
  const config = configHelper.getConfig() as AppEtlConfig;

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

  dataConfig.fileName = dataFile;

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