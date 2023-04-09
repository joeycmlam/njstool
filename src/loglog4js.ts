import * as log4js from 'log4js';
import { DataMask} from "./data-mask";

const dataMask = new DataMask();

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



const piiLogger = {
    info: (message: string) => logger.info(dataMask.mask(message)),
    warn: (message: string) => logger.warn(dataMask.mask(message)),
    error: (message: string) => logger.error(dataMask.mask(message))
};

export default piiLogger;



