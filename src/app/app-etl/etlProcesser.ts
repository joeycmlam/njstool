import {iUploader} from "../app-interface/iETL";
import ExcelReader from "../lib/excelReader";
import {iDataReader} from "../app-interface/iETL";
import Logger from "../lib/logger";

export interface FileProcessorConfig {
    fileName: string;
    query: string;
    tableName: string;
    columnNames: string[];
    rowMapper: (row: any) => any;
    truncateTable?: boolean;
    isBulkUpload: boolean;
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
        this.logger = Logger.getInstance();
    }

    public async process(): Promise<void> {
        // const excelReader = new ExcelReader(this.config.fileName);
        const data = await this.dataReader.extractData();

        try {
            await this.uploader.connect();

            if (this.config.truncateTable) {
                await this.uploader.truncateTable(this.config.tableName);
                this.logger.info(`Table [${this.config.tableName}] truncated.`);
            }

            if (this.config.isBulkUpload) {
                await this.uploader.bulkUpload(data, this.config.tableName, this.config.columnNames, this.config.rowMapper);
            } else {
                await this.uploader.uploadData(data, this.config.query, this.config.rowMapper);
            }

            this.logger.info(`Data from [${this.config.fileName}] uploaded to PostgreSQL successfully.`)
        } catch (error: any) {
            this.logger.error(`Error uploading data from [${this.config.fileName}] to PostgreSQL: ${error}`);
            this.logger.error(`Stack trace: ${error.stack}`);
        } finally {
            await this.uploader.disconnect();
        }
    }
}
