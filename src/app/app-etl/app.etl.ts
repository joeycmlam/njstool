import DatabaseConfig from "../lib/configDatabase";
import { ConfigHelper } from "../lib/configHelper";
import ExcelReader from "../lib/excelReader";
import Logger from "../lib/logger";
import DBConnection from "../lib/dbConnection";
import { accountConfig } from "./accountConfig";
import { AppEtlConfig } from "./appEtlConfig";
import { ETLProcesser, FileProcessorConfig } from "./etlProcesser";
import { holdingConfig } from "./holdingConfig";
import * as fs from 'fs';
import path from "path";

class EtlRunner {
    private accountConfig: FileProcessorConfig;
    private holdingConfig: FileProcessorConfig;
    private dbConfig: DatabaseConfig
    private logger = Logger.getLogger();

    constructor(dbConfig: DatabaseConfig, accountConfig: FileProcessorConfig, holdingConfig: FileProcessorConfig) {
        this.accountConfig = accountConfig;
        this.holdingConfig = holdingConfig;
        this.dbConfig = dbConfig;
    }

    public async run() {
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

    // const configFile = 'src/app/app-etl/config.etl.yaml';
    // const configHelper = new ConfigHelper(configFile);
    // configHelper.load();
    // const config = configHelper.getConfig() as AppEtlConfig;

    const configFile = process.argv[2] || path.join(__dirname, 'config.json');
    const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));

    // const dbConfigHelper = new ConfigHelper(config.dbConfigfile);
    // dbConfigHelper.load();
    // const dbConfig = dbConfigHelper.getConfig() as DatabaseConfig;


    const accConfig = accountConfig;
    accConfig.fileName = config.dataFile.accountFile;

    const holdConfig = holdingConfig;
    holdConfig.fileName = config.dataFile.holdingFile;

    require('dotenv').config({ path: config.envFile});

    console.log(process.env.DB_HOST); // 'localhost'
    console.log(process.env.DB_PORT); // '5432'
    console.log(process.env.DB_NAME); // 'postgres'
    console.log(process.env.DB_USER); // 'postgres'
    console.log(process.env.DB_PASSWORD); // 'dbadmin1234'

    config.database.host = process.env.DB_HOST;
    config.database.port = process.env.DB_PORT;
    config.database.database = process.env.DB_NAME;
    config.database.user = process.env.DB_USER;
    config.database.password = process.env.DB_PASSWORD;

    const runner = new EtlRunner(config.database, accountConfig, holdingConfig);
    await runner.run();
})();