import ExcelReader from "../lib/excelReader";
import PostgresUploader from "../lib/postgresUploader";
import {LoggerFactory} from "../lib/logger";

export interface FileProcessorConfig {
    filePath: string;
    query: string;
    tableName: string;
    rowMapper: (row: any) => any[];
    truncateTable?: boolean;
}

class DatabaseConfig {
}

export class ETLProcesser {
    private config: FileProcessorConfig;
    private dbConfig: DatabaseConfig;
    private logger;

    constructor(config: FileProcessorConfig, dbConfig: DatabaseConfig) {
        this.config = config;
        this.dbConfig = dbConfig;
        this.logger = LoggerFactory.getInstance().getLogger();
    }

    public async process(): Promise<void> {
        const excelReader = new ExcelReader(this.config.filePath);
        const data = await excelReader.extractData();

        const postgresUploader = new PostgresUploader(this.dbConfig);

        try {
            await postgresUploader.connect();

            if (this.config.truncateTable) {
                await postgresUploader.truncateTable(this.config.tableName);
                this.logger.info(`Table ${this.config.tableName} truncated.`);
            }

            await postgresUploader.uploadData(data, this.config.query, this.config.rowMapper);

            this.logger.info(`Data from ${this.config.filePath} uploaded to PostgreSQL successfully.`)
        } catch (error: any) {
            this.logger.error(`Error uploading data from ${this.config.filePath} to PostgreSQL: ${error}`);
            this.logger.error(`Stack trace: ${error.stack}`);
        } finally {
            await postgresUploader.disconnect();
        }
    }
}
