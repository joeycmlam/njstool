import { Given, When, Then } from '@cucumber/cucumber';
import {ETLProcesser, FileProcessorConfig} from "../../../../src/app/app-etl/etlProcesser";
import {AppEtlConfig} from "../../../../src/app/app-etl/appEtlConfig";
import ExcelReader from "../../../../src/app/lib/excelReader";
import assert from 'assert';
import PostgresUploader from '../../../../src/app/lib/postgresUploader';
import { ConfigHelper } from '../../../../src/app/lib/configHelper';
import { iAccount } from '../../../../src/app/app-etl/iRecordType';

let datProcessor: ETLProcesser;
let actualStatus: number;
let actualTotalRecord: number;

Given('the interface file {string}', async function (dataFile: string) {
  const configFile = 'src/app/app-etl/config.etl.yaml';
  const configHelper = new ConfigHelper(configFile);
  await configHelper.load();
  const config = configHelper.getConfig() as AppEtlConfig;

  // Initialize EtlProcessor with the data file

  const accountConfig: FileProcessorConfig = {
    fileName: config.dataFilePath.accountFile,
    query: 'INSERT INTO account (account_cd, account_nm) VALUES ($1, $2)',
    tableName: 'account',
    columnNames: ['account_cd', 'account_nm'],
    rowMapper: (row: iAccount) => {
        return {
            uploadDataRow: [row.account_cd, row.account_nm],
        }},
    bulkMapper: (row: iAccount) => ({
        account_cd: row.account_cd,
        account_nm: row.account_nm
    }),
    truncateTable: true,
    isBulkUpload: false, 
};


  const dataReader = new ExcelReader(dataFile);
  const dataUploader = new PostgresUploader(config.database);
  datProcessor = new ETLProcesser(accountConfig, dataUploader, dataReader);

});

When('file arrive', function () {
  // Process the file
  datProcessor.process();
});

Then('call eltProcesser.ts to load the data into database and expect the job is {int} and number of record {int}', function (expectedStatus: number, expectedTotalRecord: number) {
  // Get the actual status and total record from EtlProcessor
  actualStatus = datProcessor.getStatus();
  actualTotalRecord = datProcessor.getTotalRecord();

  // Assert that the actual status and total record match the expected values
  assert.strictEqual(actualStatus, expectedStatus);
  assert.strictEqual(actualTotalRecord, expectedTotalRecord);
});