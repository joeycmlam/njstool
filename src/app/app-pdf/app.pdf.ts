import { PdfComparator } from './PdfComparator';
import * as log4js from 'log4js';

log4js.configure({
    appenders: { out: { type: 'stdout' } },
    categories: { default: { appenders: ['out'], level: 'info' } }
  });

const logger = log4js.getLogger();

async function main() {
  const file1 = 'data/a/sample.pdf';
  const file2 = 'data/b/sample.pdf';

  const areEqual = await PdfComparator.comparePdfFiles(file1, file2);

  if (areEqual) {
    logger.info('The files are identical.');
  } else {
    logger.info('The files are different.');
  }
}

main().catch(err => logger.error(err));