// logger.ts
import * as log4js from 'log4js';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

export interface LoggerOptions {
    logLevel?: string;
    logFile?: string;
}

export class LoggerFactory {
    private static instance: LoggerFactory | null = null;
    private config: any;

    private constructor(configFileName: string) {
        this.config = this.readConfig(configFileName);
    }

    public static getInstance(configFileName: string): LoggerFactory {
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
        const logFilename = options.logFile || this.config.logger.logFile || 'application.log';
        const logLevel = options.logLevel || this.config.logger.logLevel || 'info';

        log4js.configure({
            appenders: {
                fileAppender: { type: 'file', filename: logFilename },
                console: { type: 'console' },
            },
            categories: {
                default: { appenders: ['fileAppender', 'console'], level: logLevel },
            },
        });

        return log4js.getLogger();
    }
}
