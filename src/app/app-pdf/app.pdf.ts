import path from 'path';
import { PdfComparator } from './PdfComparator';
import { Logger } from '../lib/logger';

async function main() {

  const logger = Logger.getLogger();
  const folder1 = path.join(__dirname, 'data/a');
  const folder2 = path.join(__dirname, 'data/b');

  logger.info('Comparing PDF files in folders %s and %s.', folder1, folder2);
  // await PdfComparator.comparePdfFolders(folder1, folder2);

  const file1 = path.join(__dirname, 'data/a/dummy.pdf');
  const file2 = path.join(__dirname, 'data/b/dummy.pdf');
  const result = await PdfComparator.comparePdfFiles(file1, file2);
  logger.info('The files %s and %s are %s.', file1, file2, result ? 'identical' : 'different');
  logger.info('Done.');
}

main();
