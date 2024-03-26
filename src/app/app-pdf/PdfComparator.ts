import * as fs from 'fs';
import * as path from 'path';
import * as pdf from 'pdf-parse';
import Logger from '../lib/logger';
import { injectable } from 'inversify';
import { IPdfComparator } from '../app-interface/interface';


@injectable()
export class PdfComparator implements IPdfComparator {

  private logger = Logger.getLogger();

  constructor() {
  }

  async comparePdfFiles(file1: string, file2: string): Promise<boolean> {
    let data1, data2;

    try {
      data1 = await pdf.default(fs.readFileSync(file1));
    } catch (err) {
      this.logger.error(`Error parsing file ${file1}: ${err}`);
      return false;
    }

    try {
      data2 = await pdf.default(fs.readFileSync(file2));
    } catch (err) {
      this.logger.error(`Error parsing file ${file2}: ${err}`);
      return false;
    }

    return data1.text === data2.text;
  }

  async comparePdfFolders(folder1: string, folder2: string): Promise<void> {
    const files1 = await fs.readdirSync(folder1);
    const files2 = await fs.readdirSync(folder2);

    for (const file of files1) {
      if (files2.includes(file)) {
        const file1Path = path.join(folder1, file);
        const file2Path = path.join(folder2, file);

        const areEqual = await this.comparePdfFiles(file1Path, file2Path);

        this.logger.info(`The files ${file} are ${areEqual ? 'identical' : 'different'}.`);
      } else {
        this.logger.info(`The file ${file} exists in ${folder1} but not in ${folder2}.`);
      }
    }

    for (const file of files2) {
      if (!files1.includes(file)) {
        this.logger.info(`The file ${file} exists in ${folder2} but not in ${folder1}.`);
      }
    }
  }
}