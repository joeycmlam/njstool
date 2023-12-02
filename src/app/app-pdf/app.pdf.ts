import path from 'path';
import { PdfComparator } from './PdfComparator';
import * as log4js from 'log4js';

log4js.configure({
  appenders: { out: { type: 'stdout' } },
  categories: { default: { appenders: ['out'], level: 'info' } }
});

const logger = log4js.getLogger();

async function main() {
  const folder1 = path.join(__dirname, 'data/a');
  const folder2 = path.join(__dirname, 'data/b');

  await PdfComparator.comparePdfFolders(folder1, folder2);
}

main().catch(err => logger.error(err));