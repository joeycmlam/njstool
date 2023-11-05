import { Given, When, Then } from '@cucumber/cucumber';
import { ETLProcesser, FileProcessorConfig } from "../../../../src/app/app-etl/etlProcesser";
import { AppEtlConfig } from "../../../../src/app/app-etl/appEtlConfig";
import ExcelReader from "../../../../src/app/lib/excelReader";
import assert from 'assert';
import PostgresUploader from '../../../../src/app/lib/postgresUploader';
import { ConfigHelper } from '../../../../src/app/lib/configHelper';
import { accountConfig } from "../../../../src/app/app-etl/accountConfig";
import { holdingConfig } from "../../../../src/app/app-etl/holdingConfig";

let datProcessor: ETLProcesser;
let actualStatus: number;
let actualTotalRecord: number;

Given('the interface file {string} and {string}', async function (dataFile: string, tableName: string) {
  const configFile = 'src/app/app-etl/config.etl.yaml';
  const configHelper = new ConfigHelper(configFile);
  await configHelper.load();
  const config = configHelper.getConfig() as AppEtlConfig;

  // Initialize EtlProcessor with the data file

  const dataReader = new ExcelReader(dataFile);
  const dataUploader = new PostgresUploader(config.database);

  let dataConfig: FileProcessorConfig;
  switch (tableName) {
    case 'account':
      dataConfig = accountConfig;
      break;
    case 'holding':
      dataConfig = holdingConfig;
    // Add more cases for other table names here
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