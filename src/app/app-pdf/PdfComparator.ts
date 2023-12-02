import * as fs from 'fs';
import * as pdf from 'pdf-parse';

export default class PdfComparator {
    static async comparePdfFiles(file1: string, file2: string): Promise<boolean> {
        const data1 = await pdf.default(fs.readFileSync(file1));
        const data2 = await pdf.default(fs.readFileSync(file2));

        return data1.text === data2.text;
    }
}