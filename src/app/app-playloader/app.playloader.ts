import Logger from '../lib/logger';
import path from 'path';
import ExcelToJsonConverter from './ExcelToJsonConverter';
import JsonFileWriter from './JsonFileWriter';
import ExcelReader from './ExcelReader';
import DataTransformer from './DataTransformer';
import * as fs from 'fs';
import minimist from 'minimist';


async function main() {
    const logger = Logger.getLogger();

    logger.info('start');
    // Load configuration
    // Get the config file path from the command line arguments
    const args = minimist(process.argv.slice(2));
    const configFile = args.config || path.join(__dirname, 'config.json');
    const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));

    const inFile = path.join(config.source.inputPath, config.source.inputFile);
    const outFilePath = config.output.outputPath;
    const excelReader = new ExcelReader(); // Fix: Pass the required arguments to the constructor
    const jsonFileWriter = new JsonFileWriter(); // Fix: Pass the required arguments to the constructor
    const dataTransformer = new DataTransformer(); // Fix: Pass the required arguments to the constructor
    const converter = new ExcelToJsonConverter(config, excelReader, dataTransformer, jsonFileWriter); // Fix: Pass the required arguments to the constructor
    const arr: any = await converter.convert(inFile, outFilePath);
    logger.info('jsonData', JSON.stringify(arr, null, 2));
    logger.info('end');

}

main();