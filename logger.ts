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

function redactAndLog(level: string, message: string): void {
    const filterMessage = redactor.redact(message);
    logger.info(filterMessage);
    // logger[level](filterMessage);
}

const piiLogger = {
    info: (message: string) => redactAndLog('info', message),
    warn: (message: string) => redactAndLog('warm', message),
    error: (message: string) => redactAndLog('error', message),
};

export default piiLogger;



