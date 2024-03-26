import { Client, QueryResult } from 'pg';
import { iDatabase } from "../app-interface/iETL";
import pgPromise from "pg-promise";
import Logger from './logger';


export default class DBConnection implements iDatabase {
    private client: Client;
    private logger;

    constructor(connectionConfig: any) {
        this.client = new Client(connectionConfig);
        this.logger = Logger.getLogger();

    }

    public async connect() {
        await this.client.connect();
    }

    public async disconnect() {
        await this.client.end();
    }

    public async query(query: string, params?: any[]): Promise<QueryResult> {
        let res
        try {
            res = await this.client.query(query, params);
            return res;
        } catch (ex: any) {
            this.logger.error(`Error executing query: ${query} with params: ${params} - ${ex.message}`)
            throw ex;
        } finally {
            this.logger.debug(`Query: ${query} with params: ${params}`);          
        }
        
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
        const pgp = pgPromise();
        const cs = new pgp.helpers.ColumnSet(columnNames.map(key => ({ name: key })), { table: tableName });

        const batchSize = 200; // Define batch size

        // Split data into batches
        const batches = Math.ceil(data.length / batchSize);
        for (let i = 0; i < batches; i++) {
            this.logger.info(`bulkUpload:${tableName}:batch:${i}`);
            const batch = data.slice(i * batchSize, (i + 1) * batchSize);
            const dataArray = batch.map(valueMapper);
            const insertQuery = pgp.helpers.insert(dataArray, cs);

            await this.client.query('BEGIN');
            try {
                await this.client.query(insertQuery);
                await this.client.query('COMMIT');
            } catch (error) {
                await this.client.query('ROLLBACK');
                throw error;
            }
        }

        this.logger.info(`bulkUpload:${tableName}:end`);
    }

    public async truncateTable(tableName: string): Promise<void> {
        try {
            await this.client.query(`TRUNCATE TABLE ${tableName}`);
        } catch (error) {
            throw new Error(`Error truncating table ${tableName}: ${error}`);
        }
    }

}
