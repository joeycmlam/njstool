import { LoggerFactory } from "../lib/logger";
import { iUploader } from "../app-interface/iUploader";
import ExcelReader from "../lib/excelReader";

export interface FileProcessorConfig {
    filePath: string;
    query: string;
    tableName: string;
    rowMapper: (row: any) => any[];
    truncateTable?: boolean;
}

export class ETLProcesser {
    private config: FileProcessorConfig;
    private uploader: iUploader;
    private logger;

    constructor(config: FileProcessorConfig, uploader: iUploader) {
        this.config = config;
        this.uploader = uploader;
        this.logger = LoggerFactory.getInstance().getLogger();
    }

    public async process(): Promise<void> {
        const excelReader = new ExcelReader(this.config.filePath);
        const data = await excelReader.extractData();

        try {
            await this.uploader.connect();

            if (this.config.truncateTable) {
                await this.uploader.truncateTable(this.config.tableName);
                this.logger.info(`Table [${this.config.tableName}] truncated.`);
            }

            await this.uploader.uploadData(data, this.config.query, this.config.rowMapper);

            this.logger.info(`Data from [${this.config.filePath}] uploaded to PostgreSQL successfully.`)
        } catch (error: any) {
            this.logger.error(`Error uploading data from [${this.config.filePath}] to PostgreSQL: ${error}`);
            this.logger.error(`Stack trace: ${error.stack}`);
        } finally {
            await this.uploader.disconnect();
        }
    }
}
