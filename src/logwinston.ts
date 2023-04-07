import winston from 'winston';
import {DataMasker} from "./dataMasker";


const piiFilterFormatter = winston.format.printf(({ level, message, ...metadata}) => {

    const filteredMessage = DataMasker.mask(message);
   return `${level}: ${filteredMessage}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.colorize(), piiFilterFormatter),
    transports: [new winston.transports.Console()],
});


export default logger;
