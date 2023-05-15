import { ConfigHelper } from "../lib/configHelper";
import { AppEtlConfig } from "./appEtlConfig";
import { LoggerFactory } from "../lib/logger";
import { ETLProcesser, FileProcessorConfig } from "./etlProcesser";
import { iAccount, iHolding } from "./iRecordType";
import PostgresUploader from "../lib/postgresUploader";
import ExcelReader from "../lib/excelReader";

(async () => {
    const configFile = 'src/app/app-etl/config.etl.yaml';
    const configHelper = new ConfigHelper(configFile);
    await configHelper.load();
    const config = configHelper.getConfig() as AppEtlConfig;

    const loggerFactory = LoggerFactory.getInstance(configFile);
    const logger = loggerFactory.getLogger();

    const accountConfig: FileProcessorConfig = {
        fileName: config.dataFilePath.accountFile,
        query: 'INSERT INTO account (account_cd, account_nm) VALUES ($1, $2)',
        tableName: 'account',
        rowMapper: (row: iAccount) => [row.account_cd, row.account_nm],
        truncateTable: true
    };

    const holdingConfig: FileProcessorConfig = {
        fileName: config.dataFilePath.holdingFile,
        query: 'INSERT INTO holding (account_cd, stock_cd, exchange, unit, book_cost) VALUES ($1, $2, $3, $4, $5)',
        tableName: 'holding',
        rowMapper: (holdingRow: iHolding) => [holdingRow.account_cd, holdingRow.stock_cd, holdingRow.exchange, holdingRow.unit, holdingRow.book_cost],
        truncateTable: true
    };

    logger.info('upload account and holding');

    const accountReader = new ExcelReader(accountConfig.fileName);
    const accountUploader = new PostgresUploader(config.database);
    const accountProcessor = new ETLProcesser(accountConfig, accountUploader, accountReader);

    const holdingReader = new ExcelReader(holdingConfig.fileName);
    const holdingUploader = new PostgresUploader(config.database);
    const holdingProcessor = new ETLProcesser(holdingConfig, holdingUploader, holdingReader);

    await Promise.all([
        accountProcessor.process(),
        holdingProcessor.process()
    ]);

    logger.info('done');
})();
