import { PdfComparator } from './PdfComparator';
import { Logger } from '../lib/logger';

async function main() {
  const logger = Logger.getInstance();
  const file1 = 'data/a/sample.pdf';
  const file2 = 'data/b/dummy.pdf';

  const areEqual = await PdfComparator.comparePdfFiles(file1, file2);

  if (areEqual) {
    logger.info('The files are identical.');
  } else {
    logger.info('The files are different.');
  }
}

main().catch(err => Logger.getInstance().error(err));