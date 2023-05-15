
import ExcelReader from "../lib/excelReader";
import PostgresUploader from "../lib/postgresUploader";
import { iAccount, iHolding } from "./iRecordType";
import path from "path";
import { LoggerFactory } from '../lib/logger';



(async () => {
    // Read the Excel file and extract data
    const loggerFactory = new LoggerFactory('src/app/app-etl/config.etl.yaml');
    const logger = loggerFactory.getLogger({ appName: 'app-etl' });
    const filePath: string = 'test/test-etl/test-data';
    const fileFullName = path.join(filePath, 'account-data.xlsx');
    const excelReader = new ExcelReader(fileFullName);
    const data = await excelReader.extractData();

    // Upload data to PostgreSQL
    const connectionConfig = {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'dbadmin1234',
        database: 'postgres',
    };
    const postgresUploader = new PostgresUploader(connectionConfig);

    try {
        await postgresUploader.connect();

        const query = 'INSERT INTO account (account_cd, account_nm) VALUES ($1, $2)';
        const valueMapper = (row: iAccount) => [row.account_cd, row.account_nm];

        await postgresUploader.uploadData(data, query, valueMapper);

        logger.info('Data uploaded to PostgreSQL successfully.')
    } catch (error: any) {
        logger.error(`Error uploading data to PostgreSQL: ${error}`);
        logger.error(`Stack trace: ${error.stack}`);
    } finally {
        await postgresUploader.disconnect();
    }
})();
