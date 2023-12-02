import path from 'path';
import { PdfComparator } from './PdfComparator';
import { Logger } from '../lib/logger';

async function main() {

  const logger = Logger.getLogger();
  const folder1 = path.join(__dirname, 'data/a');
  const folder2 = path.join(__dirname, 'data/b');

  logger.info('Comparing PDF files in folders %s and %s.', folder1, folder2);
  await PdfComparator.comparePdfFolders(folder1, folder2);
  logger.info('Done.');
}

main();
