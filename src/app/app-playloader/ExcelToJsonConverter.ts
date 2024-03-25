import { injectable } from 'inversify';
import path from 'path';
import ExcelReader from './ExcelReader';
import JsonFileWriter from './JsonFileWriter';
import DataTransformer from './DataTransformer';

@injectable()
export default class ExcelToJsonConverter {
  constructor(private config: any, private excelReader: ExcelReader, private dataTransformer: DataTransformer, private jsonFileWriter: JsonFileWriter) {}

  public async convert(filePath: string, outputDir: string): Promise<any> {
    const workbook = await this.excelReader.read(filePath);
    const worksheet = workbook.worksheets[0];
    const arr: any[] = [];

    for (let col = this.config.dataformat.dataStartCol; col <= worksheet.actualColumnCount; col++) {
      const { recordName, jsonData } = this.dataTransformer.transform(worksheet, col);
      arr.push(jsonData);

      const date = new Date();
      const timestamp = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}.${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
      const outputFileName = path.join(outputDir, `${recordName}.${timestamp}.json`);

      this.jsonFileWriter.write(outputFileName, jsonData);
    }
    return arr;
  }
 
}