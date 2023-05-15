// logger.ts
import * as log4js from 'log4js';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { injectable } from 'inversify';

interface LoggerOptions {
    appName: string;
}

class LoggerFactory {
    private config: Record<string, { logLevel: string }>;

    constructor(configFileName: string) {
        this.config = this.readConfig(configFileName);
    }

    private readConfig(configFileName: string): Record<string, { logLevel: string }> {
        const fileContent = fs.readFileSync(configFileName, 'utf8');
        return yaml.load(fileContent) as Record<string, { logLevel: string }>;
    }

    getLogger(options: LoggerOptions): log4js.Logger {
        const { appName } = options;

        const logFilename = `${appName}.log`;
        const logLevel = this.config[appName]?.logLevel || 'info';

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

export { LoggerFactory, LoggerOptions };
