import { Workbook } from 'exceljs';
import { injectable } from 'inversify';

@injectable()
export default class ExcelReader {
  async read(filePath: string): Promise<Workbook> {
    const workbook = new Workbook();
    await workbook.xlsx.readFile(filePath);
    return workbook;
  }
}