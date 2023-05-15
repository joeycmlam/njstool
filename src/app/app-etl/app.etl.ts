
import ExcelReader from "../lib/excelReader";
import PostgresUploader from "../lib/postgresUploader";
import { iAccount, iHolding } from "./iRecordType";
import {ConfigHelper} from "../lib/configHelper";
import {AppEtlConfig} from "./appEtlConfig";
import {LoggerFactory} from "../lib/logger";


(async () => {
    // Read the Excel file and extract data
    const configFile = 'src/app/app-etl/config.etl.yaml';
    const configHelper = new ConfigHelper(configFile);
    await configHelper.load();
    const config = configHelper.getConfig() as AppEtlConfig;

    const loggerFactory = LoggerFactory.getInstance(configFile);
    const logger = loggerFactory.getLogger();

    const acctReader = new ExcelReader(config.dataFilePath.accountFile);
    const dataAccount = await acctReader.extractData();
    const holdingReader: ExcelReader = new ExcelReader(config.dataFilePath.holdingFile);
    const dataHolding = await holdingReader.extractData();

    const postgresUploader = new PostgresUploader(config.database);

    try {
        await postgresUploader.connect();

        const query_account = 'INSERT INTO account (account_cd, account_nm) VALUES ($1, $2)';
        const accountMapper = (row: iAccount) => [row.account_cd, row.account_nm];

        const query_holding : string = 'INSERT INTO holding (account_cd, stock_cd, exchange, unit, book_cost) VALUES ($1, $2, $3, $4, $5)';

        const holdingMapper = (holdingRow: iHolding) => [holdingRow.account_cd, holdingRow.stock_cd, holdingRow.exchange, holdingRow.unit, holdingRow.book_cost];

        await postgresUploader.uploadData(dataAccount, query_account, accountMapper);

        await postgresUploader.uploadData(dataHolding, query_holding, holdingMapper);

        logger.info('Data uploaded to PostgreSQL successfully.')
    } catch (error: any) {
        logger.error(`Error uploading data to PostgreSQL: ${error}`);
        logger.error(`Stack trace: ${error.stack}`);
    } finally {
        await postgresUploader.disconnect();
    }
})();
