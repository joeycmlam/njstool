import { injectable } from 'inversify';
import path from 'path';
import excelHelper from '../lib/excelHelper'; 
import JsonFileWriter from './JsonFileWriter';
import { IDataTransformer } from './IDataTransformer';

@injectable()
export default class ExcelToJsonConverter {
  constructor(private config: any, private excelReader: excelHelper, private dataTransformer: IDataTransformer, private jsonFileWriter: JsonFileWriter) {}

  public async convert(filePath: string, outputDir: string): Promise<any> {
    const workbook = await this.excelReader.read(filePath);
    const worksheet = workbook.getWorksheet(this.config.dataformat.sheetName);
    const arr: any[] = [];

    for (let col = this.config.dataformat.dataStartCol; col <= this.config.dataformat.dataEndCol; col++) {
      const transformedData = await this.dataTransformer.transform(worksheet, col, this.config.dataformat);
      const { recordName, jsonData } = transformedData;
      arr.push(jsonData);

      const date = new Date();
      const timestamp = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}.${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
      const outputFileName = path.join(outputDir, `${recordName}.${timestamp}.json`);

      this.jsonFileWriter.write(outputFileName, jsonData);
    }
    return arr;
  }
 
}