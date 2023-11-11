import DatabaseConfig from "../lib/configDatabase";
import { ConfigHelper } from "../lib/configHelper";
import ExcelReader from "../lib/excelReader";
import Logger from "../lib/logger";
import DBConnection from "../lib/dbConnection";
import { accountConfig } from "./accountConfig";
import { AppEtlConfig } from "./appEtlConfig";
import { ETLProcesser, FileProcessorConfig } from "./etlProcesser";
import { holdingConfig } from "./holdingConfig";

class EtlRunner {
    private accountConfig: FileProcessorConfig;
    private holdingConfig: FileProcessorConfig;
    private dbConfig: DatabaseConfig
    private logger: Logger;

    constructor(appConfig: AppEtlConfig, dbConfig: DatabaseConfig, accountConfig: FileProcessorConfig, holdingConfig: FileProcessorConfig) {
        this.accountConfig = accountConfig;
        this.holdingConfig = holdingConfig;
        this.logger = Logger.getInstance();
        this.dbConfig = dbConfig;
    }

    async run() {
        this.logger.info('initialization')
        const accountReader = new ExcelReader(this.accountConfig.fileName);
        const accountUploader = new DBConnection(this.dbConfig);
        const accountProcessor = new ETLProcesser(this.accountConfig, accountUploader, accountReader);


        const holdingReader = new ExcelReader(this.holdingConfig.fileName);
        const holdingUploader = new DBConnection(this.dbConfig);
        const holdingProcessor = new ETLProcesser(this.holdingConfig, holdingUploader, holdingReader);

        this.logger.info('start upload account and holding');
        await Promise.all([
            accountProcessor.process(),
            holdingProcessor.process()
        ]);

        this.logger.info('done');
    }
}

(async () => {

    const configFile = 'src/app/app-etl/config.etl.yaml';
    const configHelper = new ConfigHelper(configFile);
    configHelper.load();
    const config = configHelper.getConfig() as AppEtlConfig;

    const dbConfigHelper = new ConfigHelper(config.dbConfigfile);
    dbConfigHelper.load();
    const dbConfig = dbConfigHelper.getConfig() as DatabaseConfig;


    const accConfig = accountConfig;
    accConfig.fileName = config.dataFilePath.accountFile;

    const holdConfig = holdingConfig;
    holdConfig.fileName = config.dataFilePath.holdingFile;

    const runner = new EtlRunner(config, dbConfig,  accountConfig, holdingConfig);
    await runner.run();
})();