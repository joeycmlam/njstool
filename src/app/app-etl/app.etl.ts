import * as fs from 'fs';
import path from "path";
import DatabaseConfig from "../lib/configDatabase";
import DBPostgresQL from "../lib/dbPostgresQL";
import ExcelReader from "../lib/excelReader";
import Logger from "../lib/logger";
import { accountConfig } from "./accountConfig";
import { ETLProcesser, FileProcessorConfig } from "./etlProcesser";
import { holdingConfig } from "./holdingConfig";
import minimist from 'minimist';
import { injectable } from 'inversify';

@injectable()
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
        const accountUploader = new DBPostgresQL(this.dbConfig);
        const accountProcessor = new ETLProcesser(this.accountConfig, accountUploader, accountReader);


        const holdingReader = new ExcelReader(this.holdingConfig.fileName);
        const holdingUploader = new DBPostgresQL(this.dbConfig);
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
    private logger = Logger.getLogger();

    constructor() {
    }

    private parseArgs() {
        const args = minimist(process.argv.slice(2));
        const configFile = args.config || path.join(__dirname, 'config.json');
        return configFile;
    }

    private readConfig(configFile: string) {
        try {
            const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
            return config;
        } catch (error) {
            this.logger.error(`Failed to read or parse configuration file: ${error}`);
            process.exit(1);
        }
    }

    private validateEnvVars(config: any) {
        require('dotenv').config({ path: config.envFile });

        const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
        requiredEnvVars.forEach((varName) => {
            if (!process.env[varName]) {
                this.logger.error(`Environment variable ${varName} is not set`);
                process.exit(1);
            }
        });

        config.database.host = process.env.DB_HOST;
        config.database.port = process.env.DB_PORT;
        config.database.database = process.env.DB_NAME;
        config.database.user = process.env.DB_USER;
        config.database.password = process.env.DB_PASSWORD;
    }


    public async run() {
        const configFile = this.parseArgs();
        const config = this.readConfig(configFile);
        this.validateEnvVars(config);

        const accConfig = accountConfig;
        accConfig.fileName = config.dataFile.accountFile;

        const holdConfig = holdingConfig;
        holdConfig.fileName = config.dataFile.holdingFile;

        try {
            this.logger.info('Start ETL process');
            const runner = new EtlRunner(config.database, accountConfig, holdingConfig);
            await runner.run();
            this.logger.info('End ETL process');
        } catch (error) {
            this.logger.error(`Failed to run ETL process: ${error}`);
        }
    }
}

const app = new App();
app.run();