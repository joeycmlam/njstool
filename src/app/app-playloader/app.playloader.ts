import { Logger } from '../lib/logger';
import path from 'path';
import ExcelToJsonConverter from './ExcelToJsonConverter';
import JsonFileWriter from './JsonFileWriter';

function main() {
    const logger = Logger.getLogger();

    logger.info('start');
    const inFile = path.join(__dirname, 'sample.xlsx');
    const outFilePath = path.join(__dirname, "output");
    const converter = new ExcelToJsonConverter();
    const jsonData = converter.convert(inFile, outFilePath);
    logger.info('end');

}

main();