import * as log4js from 'log4js';
import path from 'path';
import 'reflect-metadata';

export interface LoggerConfig {
  level?: string;
  path?: string;
  filename?: string;
}

export default class Logger {
  private static config: LoggerConfig = { level: 'info' };

  static getLogger(): log4js.Logger {
    return log4js.getLogger();
  }

  static configure(config: LoggerConfig) :void {
    Logger.config = config;
    Logger.setConfigure();
  }

  static {
    Logger.setConfigure();
  }

  private static setConfigure() {

    const appenders: { [key: string]: any } = {
      console: { type: 'console' },
    };

    if (Logger.config.filename) {
      const filePath = Logger.config.path || require.main!.path!;
      const fileFullName = path.join(filePath, Logger.config.filename);
      appenders['fileAppender'] = { type: 'dateFile', filename: fileFullName, pattern: 'yyyyMMdd.log', alwaysIncludePattern: true, keepFileExt: true };
    }
  
  
    log4js.configure({
      appenders: appenders,
      categories: {
        default: { appenders: Object.keys(appenders), level: Logger.config.level || 'info' },
      },
    });
  }

}