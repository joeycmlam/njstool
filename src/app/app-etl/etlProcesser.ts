import { LoggerFactory } from "../lib/logger";
import { iUploader } from "../app-interface/iETL";
import ExcelReader from "../lib/excelReader";
import {iDataReader} from "../app-interface/iETL";

export interface FileProcessorConfig {
    fileName: string;
    query: string;
    tableName: string;
    columnNames: string[];
    rowMapper: (row: any) => any;
    truncateTable?: boolean;
    uploadMethod: 'bulk' | 'oneByOne';
}

export class ETLProcesser {
    private config: FileProcessorConfig;
    private dataReader: iDataReader;
    private uploader: iUploader;
    private logger;

    constructor(config: FileProcessorConfig, uploader: iUploader, dataReader: iDataReader) {
        this.config = config;
        this.uploader = uploader;
        this.dataReader = dataReader;
        this.logger = LoggerFactory.getInstance().getLogger();
    }

    public async process(): Promise<void> {
        const excelReader = new ExcelReader(this.config.fileName);
        const data = await this.dataReader.extractData();

        try {
            await this.uploader.connect();

            if (this.config.truncateTable) {
                await this.uploader.truncateTable(this.config.tableName);
                this.logger.info(`Table [${this.config.tableName}] truncated.`);
            }

            if (this.config.uploadMethod === 'bulk') {
                await this.uploader.bulkUpload(data, this.config.tableName, this.config.columnNames, this.config.rowMapper);
            } else if (this.config.uploadMethod === 'oneByOne') {
                await this.uploader.uploadData(data, this.config.query, this.config.rowMapper);
            }
            // await this.uploader.uploadData(data, this.config.query, this.config.rowMapper);
            // await this.uploader.bulkUpload(data, this.config.tableName, this.config.columnNames, this.config.rowMapper);

            this.logger.info(`Data from [${this.config.fileName}] uploaded to PostgreSQL successfully.`)
        } catch (error: any) {
            this.logger.error(`Error uploading data from [${this.config.fileName}] to PostgreSQL: ${error}`);
            this.logger.error(`Stack trace: ${error.stack}`);
        } finally {
            await this.uploader.disconnect();
        }
    }
}
