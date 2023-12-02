import path from 'path';
import { PdfComparator } from './PdfComparator';
import { Logger } from '../lib/logger';
import config from './config';

async function main() {

  const logger = Logger.getLogger();

  const folder1 = path.join(__dirname, config.folder1);
  const folder2 = path.join(__dirname, config.folder2);
  const comparator = new PdfComparator();

  
  // Compare two folders with PDF files in folders
  logger.info('Comparing PDF files in folders %s and %s.', folder1, folder2);
  const areEqual = await comparator.comparePdfFiles(config.folder1, config.folder2);

  // Compare two PDF files
  const file1 = path.join(__dirname, config.file1);
  const file2 = path.join(__dirname, config.file2);
  const result = await comparator.comparePdfFiles(file1, file2);
  logger.info(`The files ${file1} and ${file2} are ${result ? 'identical' : 'different'}.`);
  logger.info('Done.');
}

main();
