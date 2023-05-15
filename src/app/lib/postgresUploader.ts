import { Client } from 'pg';
import {LoggerFactory} from "./logger";


export default class PostgresUploader {
    private client: Client;
    private logger;

    constructor(connectionConfig: any) {
        this.client = new Client(connectionConfig);
        this.logger = LoggerFactory.getInstance().getLogger();
    }

    async connect() {
        await this.client.connect();
    }

    async disconnect() {
        await this.client.end();
    }

    async uploadData(data: any, query: any, valueMapper: any) {
        this.logger.info(`uploadData:start:${query}`);
        for (const row of data) {
            await this.client.query(query, valueMapper(row));
            this.logger.debug(`value: ${row}`);
        }
        this.logger.info('uploadData:end');
    }
}
