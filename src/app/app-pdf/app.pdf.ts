import path from 'path';
import { Logger } from '../lib/logger';
import config from './config';
import { Container, inject, injectable } from 'inversify';
import { TYPES, IPdfComparator } from '../app-interface/interface'; 
import { PdfComparator } from './PdfComparator'; // Make sure to import PdfComparator

@injectable() // Add this line
class Main {
  private comparator: IPdfComparator;
  private logger = Logger.getLogger();

  constructor(
    @inject(TYPES.IPdfComparator) comparator: IPdfComparator
  ) {
    this.comparator = comparator;
  }

  async run() {
    const folder1 = path.join(__dirname, config.folder1);
    const folder2 = path.join(__dirname, config.folder2);
    
    // Compare two folders with PDF files in folders
    this.logger.info('Comparing PDF files in folders %s and %s.', folder1, folder2);
    const areEqual = await this.comparator.comparePdfFiles(config.folder1, config.folder2);
  
    // Compare two PDF files
    const file1 = path.join(__dirname, config.file1);
    const file2 = path.join(__dirname, config.file2);
    const result = await this.comparator.comparePdfFiles(file1, file2);
    this.logger.info(`The files ${file1} and ${file2} are ${result ? 'identical' : 'different'}.`);
    this.logger.info('Done.');
  }
}

const container = new Container();
container.bind<IPdfComparator>(TYPES.IPdfComparator).to(PdfComparator);

const main = container.resolve(Main);
main.run();