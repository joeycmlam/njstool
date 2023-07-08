import * as log4js from 'log4js';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

export interface LoggerOptions {
    logLevel?: string;
    logFile?: string;
    logFilePattern?: string;
}

export default class LoggerFactory {
    private static instance: LoggerFactory | null = null;
    private configFile: string = 'application.log';
    private config: any;
    private logger: log4js.Logger | null = null;

    private constructor(configFileName: string) {
        this.configFile = configFileName;
        this.config = this.readConfig(configFileName);
    }

    public static getInstance(configFileName: string = 'config.yaml'): LoggerFactory {
        if (!this.instance) {
            this.instance = new LoggerFactory(configFileName);
        }
        return this.instance;
    }

    private readConfig(configFileName: string): any {
        const fileContent = fs.readFileSync(configFileName, 'utf8');
        return yaml.load(fileContent);
    }

    public getLogger(options: LoggerOptions = {}): log4js.Logger {
        if (this.logger) {
            return this.logger;
        }

        const logFilePrefix = options.logFile || this.config.logger.logFile || 'application';
        const logFilePattern = options.logFilePattern || this.config.logger.logFilePattern || 'yyyyMMdd.log';
        const logFilename = `${logFilePrefix}`;
        const logLevel = options.logLevel || this.config.logger.logLevel || 'info';

        log4js.configure({
            appenders: {
                fileAppender: { type: 'dateFile', filename: logFilename, pattern: logFilePattern, alwaysIncludePattern: true },
                console: { type: 'console' },
            },
            categories: {
                default: { appenders: ['fileAppender', 'console'], level: logLevel },
            },
        });

        this.logger = log4js.getLogger();
        return this.logger;
    }
}
