import * as log4js from 'log4js';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import 'reflect-metadata';


export default class Logger {
  private static instance: Logger;
  private static config: { filename?: string, level?: string };

  static getLogger(): log4js.Logger {
    return log4js.getLogger();
  }

  static {
    let config: { filename?: string, level?: string };
    const configFile = path.resolve(require.main!.path!, './config.logger.yaml');

    try {
      const configData = fs.readFileSync(configFile, 'utf-8');
      config = yaml.load(configData) as { filename?: string, level?: string };
    } catch (err) {
      // Default configuration
      config = {
        filename: 'app',
        level: 'info'
      };
    }

    Logger.instance = new Logger(config);
  }
  
  private constructor(config: { filename?: string, level?: string }) {
    const logFilePattern = 'yyyyMMdd.log';
    Logger.config = config;

    const fileName = Logger.config.filename || 'app';
    const level = Logger.config.level || 'info';

    log4js.configure({
      appenders: {
        fileAppender: { type: 'dateFile', filename: fileName, pattern: logFilePattern, alwaysIncludePattern: true, keepFileExt: true },
        console: { type: 'console' },
      },
      categories: {
        default: { appenders: ['fileAppender', 'console'], level: level },
      },
    });
  }
}