import * as log4js from 'log4js';
import { SyncRedactor } from 'redact-pii';

const redactor = new SyncRedactor();

log4js.configure({
    appenders: {
        console: { type: 'console' },
        file: { type: 'file', filename: 'app.log' },
    },
    categories: {
        default: { appenders: ['console', 'file'], level: 'info'},
    },
});

const logger = log4js.getLogger();

function datamask(message: string): string {
    const maskedMessage = redactor.redact(message);
    return maskedMessage;
}

const piiLogger = {
    info: (message: string) => logger.info(datamask(message)),
    warn: (message: string) => logger.warn(datamask(message)),
    error: (message: string) => logger.error(datamask(message))
};

export default piiLogger;



