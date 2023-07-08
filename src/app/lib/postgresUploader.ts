import {Client} from 'pg';
import {Logger} from "./logger";
import {iUploader} from "../app-interface/iETL";
import pgPromise from "pg-promise";


export default class PostgresUploader implements iUploader {
    private client: Client;
    private logger;

    constructor(connectionConfig: any) {
        this.client = new Client(connectionConfig);
        this.logger = LoggerFactory.getInstance().getLogger();
    }

    public async connect() {
        await this.client.connect();
    }

    public async disconnect() {
        await this.client.end();
    }

    public async uploadData(data: any, query: any, valueMapper: any) {
        this.logger.info(`uploadData:start:${query}`);

        for (const row of data) {
            await this.client.query(query, valueMapper(row).uploadDataRow);
            this.logger.debug(`value: ${JSON.stringify(row)}`);
        }

        this.logger.info('uploadData:end');
    }

    public async bulkUpload(data: any, tableName: string, columnNames: string[], valueMapper: any) {
        this.logger.info(`bulkUpload:start:${tableName}`);

        //TODO: need to fix in here...

        try {
            const pgp = pgPromise();
            const dataArray = data.map(valueMapper);
            // const dataArray = data.map(row => valueMapper(row).bulkUploadRow);
            const cs = new pgp.helpers.ColumnSet(columnNames.map(key => ({ name: key })), { table: tableName });
            const insertQuery = pgp.helpers.insert(dataArray, cs);

            await this.client.query('BEGIN');
            this.logger.debug(insertQuery);
            await this.client.query(insertQuery);
            await this.client.query('COMMIT');
        } catch (error) {
            await this.client.query('ROLLBACK');
            throw error;
        } finally {
            this.logger.info('bulkUpload:end');
        }
    }

    public async truncateTable(tableName: string): Promise<void> {
        try {
            await this.client.query(`TRUNCATE TABLE ${tableName}`);
        } catch (error) {
            throw new Error(`Error truncating table ${tableName}: ${error}`);
        }
    }

}
