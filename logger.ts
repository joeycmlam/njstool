import winston from 'winston';

const { SyncRedactor } = require('redact-pii');
const redactor = new SyncRedactor();


const piiFilterFormatter = winston.format.printf(({ level, message, ...metadata}) => {
    const piiPattern = /b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

    // const piiPattern = /.com\b/g;

   // const filteredMessage = message.replace(message, '****.');

    const filteredMessage = redactor.redact(message);
   return `${level}: ${filteredMessage}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.colorize(), piiFilterFormatter),
    transports: [new winston.transports.Console()],
});

export default logger;
