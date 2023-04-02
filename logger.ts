import * as log4js from 'log4js';
import { SyncRedactor } from 'redact-pii';
import {Level} from "log4js";

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

function redactAndLog(level: log4js.Level, message: string): void {
    const filterMessage = redactor.redact(message);
    logger["info"](filterMessage);
}

const piiLogger = {
    info: (message: string) => redactAndLog(log4js.levels.INFO, message),
    warn: (message: string) => redactAndLog(log4js.levels.WARN, message),
    error: (message: string) => redactAndLog(log4js.levels.ERROR, message),
};

export default piiLogger;



