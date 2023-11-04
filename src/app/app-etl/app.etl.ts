import {ConfigHelper} from "../lib/configHelper";
import {AppEtlConfig} from "./appEtlConfig";
import {ETLProcesser, FileProcessorConfig} from "./etlProcesser";
import {iAccount, iHolding} from "./iRecordType";
import PostgresUploader from "../lib/postgresUploader";
import ExcelReader from "../lib/excelReader";
import Logger from "../lib/logger";

(async () => {
    const configFile = 'src/app/app-etl/config.etl.yaml';
    const configHelper = new ConfigHelper(configFile);
    await configHelper.load();
    const config = configHelper.getConfig() as AppEtlConfig;

    const logger = Logger.getInstance();

    const accountConfig: FileProcessorConfig = {
        fileName: config.dataFilePath.accountFile,
        query: 'INSERT INTO account (account_cd, account_nm) VALUES ($1, $2)',
        tableName: 'account',
        columnNames: ['account_cd', 'account_nm'],
        rowMapper: (row: iAccount) => {
                row.account_cd, row.account_nm
            ;
        },
        truncateTable: true,
        isBulkUpload: false, 
    };

    const holdingConfig: FileProcessorConfig = {
        fileName: config.dataFilePath.holdingFile,
        query: 'INSERT INTO holding (account_cd, stock_cd, exchange, unit, book_cost) VALUES ($1, $2, $3, $4, $5)',
        tableName: 'holding',
        columnNames: ['account_cd', 'stock_cd', 'exchange', 'unit', 'book_cost'],
        rowMapper: (row: iHolding) => {
                row.account_cd, row.stock_cd, row.exchange, row.unit, row.book_cost
            ;
        },
        truncateTable: true,
        isBulkUpload: false, // or 'bulk' for bulkUpload
    };


    logger.info('initialization')
    const accountReader = new ExcelReader(accountConfig.fileName);
    const accountUploader = new PostgresUploader(config.database);
    const accountProcessor = new ETLProcesser(accountConfig, accountUploader, accountReader);

    const holdingReader = new ExcelReader(holdingConfig.fileName);
    const holdingUploader = new PostgresUploader(config.database);
    const holdingProcessor = new ETLProcesser(holdingConfig, holdingUploader, holdingReader);

    logger.info('start upload account and holding');
    await Promise.all([
        accountProcessor.process(),
        holdingProcessor.process()
    ]);

    logger.info('done');
})();
