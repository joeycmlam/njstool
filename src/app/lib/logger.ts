import * as log4js from 'log4js';

class Logger {
  private static instance: Logger;
  private logger: log4js.Logger;

  private constructor() {

    const logFilePrefix = 'application';
    const logFilePattern = 'yyyyMMdd.log';
    const logFilename = `${logFilePrefix}`;
    const logLevel = 'info';

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
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public error(message: string): void {
    this.logger.error(message);
  }

  // Add other log levels as needed
}

export default Logger;