import { Logger } from '../lib/logger';
import path from 'path';
import ExcelToJsonConverter from './ExcelToJsonConverter';

function main() {
    const logger = Logger.getLogger();

    logger.info('start');
    const inFile = path.join(__dirname, 'sample.xlsx');
    const outFilePath = path.join(__dirname, "output");
    const converter = new ExcelToJsonConverter();
    converter.convert(inFile, outFilePath);
    logger.info('end');

}

main();