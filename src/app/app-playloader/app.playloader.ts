import { Logger } from '../lib/logger';
import path from 'path';
import ExcelToJsonConverter from './ExcelToJsonConverter';
import JsonFileWriter from './JsonFileWriter';
import ExcelReader from './ExcelReader';
import DataTransformer from './DataTransformer';

function main() {
    const logger = Logger.getLogger();

    logger.info('start');
    const inFile = path.join(__dirname, 'sample.xlsx');
    const outFilePath = path.join(__dirname, "output");
    const excelReader = new ExcelReader(); // Fix: Pass the required arguments to the constructor
    const jsonFileWriter = new JsonFileWriter(); // Fix: Pass the required arguments to the constructor
    const dataTransformer = new DataTransformer(); // Fix: Pass the required arguments to the constructor
    const converter = new ExcelToJsonConverter(excelReader, dataTransformer, jsonFileWriter); // Fix: Pass the required arguments to the constructor
    const jsonData = converter.convert(inFile, outFilePath);
    logger.info('end');

}

main();