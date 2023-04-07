import winston from 'winston';
import {dataMask} from "./data-mask";


const piiFilterFormatter = winston.format.printf(({ level, message, ...metadata}) => {

    const filteredMessage = dataMask.mask(message);
   return `${level}: ${filteredMessage}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.colorize(), piiFilterFormatter),
    transports: [new winston.transports.Console()],
});


export default logger;
