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

function redactAntLog(level: string, message: string): void {
    const filterMessage = redactor.redact(message);
    logger[level](filterMessage);
}

const piiLogger = {
    info: (message: string) => redactAntLog('info', message),
    warn: (message: string) => redactAntLog('warn', message),
    error: (message: string) => redactAntLog('error', message),
};

export default piiLogger;



