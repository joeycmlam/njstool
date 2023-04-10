import * as log4js from 'log4js';
import {DataMask} from "./data-mask";


export default class MaskedLogger {
    private logger: log4js.Logger;
    private dataMask = new DataMask();

    constructor(category: string, level?: log4js.Level) {
        this.logger = log4js.getLogger(category);
        if (level) {
            this.logger.level = level.toString();
        }

        // Configure log4js
        log4js.configure({
            appenders: {
                console: { type: 'console' },
            },
            categories: {
                default: { appenders: ['console'], level: category},
            },
        });
    }

    private redactMessage(message: string): any {
        return this.dataMask.mask(message);
    }

    public info(...args: any[]): void {
        const redactedArgs = args.map((arg) => this.redactMessage(arg));
        this.logger.info(redactedArgs.join(' '));
    }

    public debug(...args: any[]): void {
        // const redactedArgs = args.map((arg) => this.redactMessage(arg));
        this.logger.debug(args);
    }

    public warn(...args: any[]): void {
        const redactedArgs = args.map((arg) => this.redactMessage(arg));
        this.logger.warn(redactedArgs.join(' '));
    }

    public error(...args: any[]): void {
        const redactedArgs = args.map((arg) => this.redactMessage(arg));
        this.logger.error(redactedArgs.join(' '));
    }

}


