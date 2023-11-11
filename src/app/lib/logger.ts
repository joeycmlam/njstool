import * as log4js from 'log4js';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import configLogger from './configLogger';
import { BaseConfig } from './configHelper';


class Logger {
  static getLogger() {
    throw new Error('Method not implemented.');
  }
  private static instance: Logger;
  private logger: log4js.Logger;
  private static config: configLogger;


  static {
    const configFile = path.resolve(require.main!.path!, './config.logger.yaml');
    const configData = fs.readFileSync(configFile, 'utf-8');
    const config = yaml.load(configData) as configLogger;
    Logger.instance = new Logger(config);
  }

  private constructor(config: configLogger) {

    const logFilePattern = 'yyyyMMdd.log';
    Logger.config = config;

    const fileName = Logger.config.filename || 'app';
    const level = Logger.config.level || 'info';

    log4js.configure({
      appenders: {
        fileAppender: { type: 'dateFile', filename: fileName, pattern: logFilePattern, alwaysIncludePattern: true },
        console: { type: 'console' },
      },
      categories: {
        default: { appenders: ['fileAppender', 'console'], level: level },
      },
    });

    this.logger = log4js.getLogger();
  }

  public static getInstance(): Logger {
    // if (!Logger.instance) {
    //   Logger.instance = new Logger();
    // }
    return Logger.instance;
  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public error(message: string): void {
    this.logger.error(message);
  }

  public debug(message: string): void {
    this.logger.debug(message);
  }

  // Add other log levels as needed
}

export default Logger;