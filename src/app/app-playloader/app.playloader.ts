import { Logger } from '../lib/logger';
import path from 'path';
import ExcelToJsonConverter from './ExcelToJsonConverter';
import JsonFileWriter from './JsonFileWriter';
import ExcelReader from './ExcelReader';
import DataTransformer from './DataTransformer';
import * as fs from 'fs';
;

async function main() {
    const logger = Logger.getLogger();

    logger.info('start');
    // Load configuration
    const configFile: string = path.join(__dirname, 'config.json'); 
    const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));

    const inFile = path.join(__dirname, config.inputFile);
    const outFilePath = path.join(__dirname, config.outputPath);
    const excelReader = new ExcelReader(); // Fix: Pass the required arguments to the constructor
    const jsonFileWriter = new JsonFileWriter(); // Fix: Pass the required arguments to the constructor
    const dataTransformer = new DataTransformer(); // Fix: Pass the required arguments to the constructor
    const converter = new ExcelToJsonConverter(excelReader, dataTransformer, jsonFileWriter); // Fix: Pass the required arguments to the constructor
    const arr: any = await converter.convert(inFile, outFilePath);
    logger.info('jsonData', JSON.stringify(arr, null, 2));
    logger.info('end');

}

main();