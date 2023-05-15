import {Client} from 'pg';
import {LoggerFactory} from "./logger";


export default class PostgresUploader {
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
            await this.client.query(query, valueMapper(row));
            this.logger.debug(`value: ${row}`);
        }
        this.logger.info('uploadData:end');
    }

    public async truncateTable(tableName: string): Promise<void> {
        try {
            await this.client.query(`TRUNCATE TABLE ${tableName}`);
        } catch (error) {
            throw new Error(`Error truncating table ${tableName}: ${error}`);
        }
    }

}
