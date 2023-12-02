import * as fs from 'fs';
import * as path from 'path';
import * as pdf from 'pdf-parse';

export class PdfComparator {
  static async comparePdfFiles(file1: string, file2: string): Promise<boolean> {
    const data1 = await pdf.default(fs.readFileSync(file1));
    const data2 = await pdf.default(fs.readFileSync(file2));

    return data1.text === data2.text;
  }

  static async comparePdfFolders(folder1: string, folder2: string): Promise<void> {
    const files1 = fs.readdirSync(folder1);
    const files2 = fs.readdirSync(folder2);
  
    for (const file of files1) {
      if (files2.includes(file)) {
        const file1Path = path.join(folder1, file);
        const file2Path = path.join(folder2, file);
  
        const areEqual = await PdfComparator.comparePdfFiles(file1Path, file2Path);
  
        console.info(`The files ${file} are ${areEqual ? 'identical' : 'different'}.`);
      } else {
        console.info(`The file ${file} exists in ${folder1} but not in ${folder2}.`);
      }
    }
  
    for (const file of files2) {
      if (!files1.includes(file)) {
        console.info(`The file ${file} exists in ${folder2} but not in ${folder1}.`);
      }
    }
  }
}