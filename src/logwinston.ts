import winston, {Logger as WinstonLogger} from 'winston';
import dayjs from 'dayjs';
import {dataMask} from './data-mask';

class Logger {
    private logger: WinstonLogger;

    constructor(logLevel: string = 'info') {
        const piiFilterFormatter = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
            const filteredMessage = dataMask.mask(message);
            const location = this.getCallerLocation();
            return `${timestamp} ${level} [${location}]: ${filteredMessage}`;
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


    private getCallerLocation(): string {
        let location : string = '';

        try {
            const error = new Error();
            const stackLines = error.stack?.split('\n') || [];
            const callerLine = stackLines[4]; // Adjust the index if needed

            if (!callerLine) {
                return 'unknown';
            }

            location = callerLine
                .trim()
                .replace(/^at\s+/, '')
                .replace(/^.+\((.+)\)$/, '$1');
        } catch (err) {
            //ignore
        } finally {
            return location;
        }

    }
}

export default Logger;
