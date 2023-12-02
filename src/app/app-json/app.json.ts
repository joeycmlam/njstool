import { JsonComparator } from './JsonComparator';
import { Logger } from '../lib/logger';
import { config } from './config';
import path from 'path';

function main() {

  const logger = Logger.getLogger();

  try {
    logger.info('Comparing json1 and json2');
    const resultsFilePath = path.join(__dirname, config.resultsFile);
    const comparator = new JsonComparator(resultsFilePath);
  
    const folder1 = path.join(__dirname, config.folder1);
    const folder2 = path.join(__dirname, config.folder2);
    comparator.compareFolders(folder1, folder2);
    logger.info('Done');   
  } catch (err) {
    logger.error(err);
  }

 
}

main();