import winston, {Logger as WinstonLogger} from 'winston';
import dayjs from 'dayjs';
import {dataMask} from './data-mask';

class Logger {
    private logger: WinstonLogger;

    constructor(logLevel: string = 'info') {
        const piiFilterFormatter = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
            const filteredMessage = dataMask.mask(message);
            return `${timestamp} ${level}: ${filteredMessage}`;
        });

        this.logger = winston.createLogger({
            level: logLevel,
            format: winston.format.combine(
                winston.format.timestamp({ format: () => dayjs().format('YYYY-MM-DD HH:mm:ss') }),
                winston.format.colorize(),
                piiFilterFormatter
            ),
            transports: [new winston.transports.Console()],
        });
    }

    public info(message: string): void {
        this.logger.info(message);
    }

    public warn(message: string): void {
        this.logger.warn(message);
    }

    public error(message: string): void {
        this.logger.error(message);
    }

    public debug(message: string): void {
        this.logger.debug(message);
    }
}

export default Logger;
