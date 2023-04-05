import * as log4js from 'log4js';
import { DataMasker} from "./dataMasker";


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
    info: (message: string) => logger.info(DataMasker.datamask(message)),
    warn: (message: string) => logger.warn(DataMasker.datamask(message)),
    error: (message: string) => logger.error(DataMasker.datamask(message))
};

export default piiLogger;



