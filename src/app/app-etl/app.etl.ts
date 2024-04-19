import * as fs from 'fs';
import path from "path";
import DatabaseConfig from "../lib/configDatabase";
import DBConnection from "../lib/dbConnection";
import ExcelReader from "../lib/excelReader";
import Logger from "../lib/logger";
import { accountConfig } from "./accountConfig";
import { ETLProcesser, FileProcessorConfig } from "./etlProcesser";
import { holdingConfig } from "./holdingConfig";
import minimist from 'minimist';

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

class App {
    constructor() {
    }


    public async run() {

        const args = minimist(process.argv.slice(2));
        const configFile = args.config || path.join(__dirname, 'config.json');
        const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));

        require('dotenv').config({ path: config.envFile });
        config.database.host = process.env.DB_HOST;
        config.database.port = process.env.DB_PORT;
        config.database.database = process.env.DB_NAME;
        config.database.user = process.env.DB_USER;
        config.database.password = process.env.DB_PASSWORD;

        const accConfig = accountConfig;
        accConfig.fileName = config.dataFile.accountFile;

        const holdConfig = holdingConfig;
        holdConfig.fileName = config.dataFile.holdingFile;

        const runner = new EtlRunner(config.database, accountConfig, holdingConfig);
        await runner.run();
    }
}

const app = new App();
app.run();