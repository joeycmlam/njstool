import { Logger } from '../lib/logger';
import { Workbook } from 'exceljs';
import { writeFileSync } from 'fs';
import { injectable } from 'inversify';
import path from 'path';

@injectable()
class ExcelToJsonConverter {
  async convert(sourceFileName: string, outputPath: string): Promise<void> {
    const workbook = new Workbook();
    await workbook.xlsx.readFile(sourceFileName);

    const worksheet = workbook.worksheets[0];
    const jsonData: any = {};
    let recordName = '';

    worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
        recordName = row.getCell(3)?.value?.toString() || '';
    } else {
        const field = row.getCell(1)?.value?.toString();
        const type = row.getCell(2)?.value?.toString();
        const value = row.getCell(3).value;

        let target = jsonData;
        const splitField = (field ?? '').split('.');
        splitField.forEach((part, index) => {
            if (index === splitField.length - 1) {
                if (type?.startsWith('list')) {
                    if (!target[part]) target[part] = [];
                    target[part].push(value);
                } else {
                    target[part] = type === 'num' ? Number(value) : String(value);
                }
            } else {
                if (!target[part]) target[part] = {};
                target = target[part];
            }
        });
      }
    });

    const date = new Date();
    const timestamp = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}.${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
    const outputFileName = path.join(outputPath, `${recordName}.${timestamp}.json`);

    writeFileSync(outputFileName, JSON.stringify(jsonData, null, 2));
  }
}


function main() {
    const logger = Logger.getLogger();

    logger.info('start');
    const inFile = path.join(__dirname, 'sample.xlsx');
    const outFilePath = path.join(__dirname, "output");
    const converter = new ExcelToJsonConverter();
    converter.convert(inFile, outFilePath);
    logger.info('end');

}

main();