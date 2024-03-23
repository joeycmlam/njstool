import { Workbook } from 'exceljs';
import { writeFileSync } from 'fs';
import { injectable } from 'inversify';
import path from 'path';

@injectable()
export default class ExcelToJsonConverter {
  async convert(filePath: string, outputDir: string): Promise<void> {
    const workbook = new Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.worksheets[0];

    for (let col = 3; col <= worksheet.actualColumnCount; col++) {
      const jsonData: any = {};
      let recordName = '';

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
            recordName = row.getCell(col)?.value?.toString() ?? '';
        } else {
          const field = row.getCell(1)?.value?.toString();
          const type = row.getCell(2)?.value?.toString();
          const value = row.getCell(col).value;

          let target = jsonData;
          const splitField = field?.split('.');
          splitField?.forEach((part, index) => {
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
      const outputFileName = path.join(outputDir, `${recordName}.${timestamp}.json`);

      writeFileSync(outputFileName, JSON.stringify(jsonData, null, 2));
    }
  }
}