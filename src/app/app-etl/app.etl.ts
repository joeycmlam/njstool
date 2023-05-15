import { ConfigHelper } from "../lib/configHelper";
import { AppEtlConfig } from "./appEtlConfig";
import { LoggerFactory } from "../lib/logger";
import {ETLProcesser, FileProcessorConfig} from "./etlProcesser";
import {iAccount, iHolding} from "./iRecordType";

(async () => {
    const configFile = 'src/app/app-etl/config.etl.yaml';
    const configHelper = new ConfigHelper(configFile);
    await configHelper.load();
    const config = configHelper.getConfig() as AppEtlConfig;

    const loggerFactory = LoggerFactory.getInstance(configFile);
    const logger = loggerFactory.getLogger();

    const accountConfig: FileProcessorConfig = {
        filePath: config.dataFilePath.accountFile,
        query: 'INSERT INTO account (account_cd, account_nm) VALUES ($1, $2)',
        tableName: 'account',
        rowMapper: (row: iAccount) => [row.account_cd, row.account_nm],
        truncateTable: true
    };

    const holdingConfig: FileProcessorConfig = {
        filePath: config.dataFilePath.holdingFile,
        query: 'INSERT INTO holding (account_cd, stock_cd, exchange, unit, book_cost) VALUES ($1, $2, $3, $4, $5)',
        tableName: 'holding',
        rowMapper: (holdingRow: iHolding) => [holdingRow.account_cd, holdingRow.stock_cd, holdingRow.exchange, holdingRow.unit, holdingRow.book_cost],
        truncateTable: true
    };

    logger.info('upload account');
    const accountProcessor = new ETLProcesser(accountConfig, config.database);
    await accountProcessor.process();

    logger.info('upload holding');
    const holdingProcessor = new ETLProcesser(holdingConfig, config.database);
    await holdingProcessor.process();

    logger.info('done');
})();
