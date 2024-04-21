import { iDatabase, iDataReader } from "../app-interface/iRDMBS";
import Logger from "../lib/logger";

export interface FileProcessorConfig {
    fileName: string;
    query: string;
    tableName: string;
    columnNames: string[];
    rowMapper: (row: any) => any;
    bulkMapper: (row: any) => any;
    truncateTable?: boolean;
    isBulkUpload: boolean;
}

export class ETLProcesser {
    private config: FileProcessorConfig;
    private dataReader: iDataReader;
    private uploader: iDatabase;
    private logger;
    private status: number;
    private totalRecord: number;
    private sourceData: any;

    constructor(config: FileProcessorConfig, uploader: iDatabase, dataReader: iDataReader) {
        this.config = config;
        this.uploader = uploader;
        this.dataReader = dataReader;
        this.logger = Logger.getLogger();
        this.status = 0;
        this.totalRecord = 0;
    }

    public getStatus(): number {
        return this.status;
    }

    public getTotalRecord(): number {
        return this.totalRecord;
    }

    public async process(): Promise<{}> {

        try {
            this.sourceData = await this.dataReader.extractData();
            this.logger.info(`Number of Record [${this.sourceData.length}] Data extracted from [${this.config.fileName}].`);
            await this.uploader.connect();

            if (this.config.truncateTable) {
                await this.uploader.truncateTable(this.config.tableName);
                this.logger.info(`Table [${this.config.tableName}] truncated.`);
            }

            if (this.config.isBulkUpload) {
                await this.uploader.bulkUpload(this.sourceData, this.config.tableName, this.config.columnNames, this.config.bulkMapper);
            } else {
                await this.uploader.uploadData(this.sourceData, this.config.query, this.config.rowMapper);
            }

            this.logger.info(`Data from [${this.config.fileName}] uploaded to PostgreSQL successfully.`)
        } catch (error: any) {
            this.logger.error(`Error uploading data from [${this.config.fileName}] to PostgreSQL: ${error}`);
            this.logger.error(`Stack trace: ${error.stack}`);
            this.status = -1;
            this.totalRecord = 0;
        } finally {
            await this.uploader.disconnect();
            this.status = 0;
            this.totalRecord = this.sourceData.length;
        }

        return { status: this.status, totalRecord: this.totalRecord }
    }
}
