
import {LoggerFactory} from "../lib/logger";


(async () => {
    const loggerFactory = LoggerFactory.getInstance('src/app/app-fee/config.yaml');
    const logger = loggerFactory.getLogger();
    logger.info('start');

    logger.info('end');
})();

