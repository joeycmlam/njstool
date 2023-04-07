import winston, {Logger as WinstonLogger} from 'winston';
import dayjs from 'dayjs';
import {dataMask} from './data-mask';

class Logger {
    private logger: WinstonLogger;

    constructor(logLevel: string = 'info') {
        const piiFilterFormatter = winston.format.printf(({ level, message, timestamp, location, ...metadata }) => {
            const filteredMessage = dataMask.mask(message);
            return `[${location}] ${timestamp} ${level} : ${filteredMessage}`;
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
        const location = this.getCallerLocation();
        this.logger.info({message, location});
    }

    public warn(message: string): void {
        const location = this.getCallerLocation();
        this.logger.warn({message, location});
    }

    public error(message: string): void {
        const location = this.getCallerLocation();
        this.logger.error({message, location});
    }

    public debug(message: string): void {
        const location = this.getCallerLocation();
        this.logger.debug({message, location});
    }


    private getCallerLocation(): string {
        let location: string = '';

        try {
            const error = new Error();
            const stackLines = error.stack?.split('\n') || [];
            const callerLine = stackLines[3]; // Adjust the index if needed

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
