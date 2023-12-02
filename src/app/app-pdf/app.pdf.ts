import path from 'path';
import { PdfComparator } from './PdfComparator';
import { Logger } from '../lib/logger';
import config from './config';

async function main() {

  const logger = Logger.getLogger();
  const folder1 = path.join(__dirname, config.folder1);
  const folder2 = path.join(__dirname, config.folder2);

  // Compare two folders with PDF files in folders
  logger.info('Comparing PDF files in folders %s and %s.', folder1, folder2);
  await PdfComparator.comparePdfFolders(folder1, folder2);

  // Compare two PDF files
  const file1 = path.join(__dirname, config.file1);
  const file2 = path.join(__dirname, config.file2);
  const result = await PdfComparator.comparePdfFiles(file1, file2);
  logger.info('The files %s and %s are %s.', file1, file2, result ? 'identical' : 'different');
  logger.info('Done.');
}

main();
