import { injectable } from "inversify";
import StringeHelper from "../lib/stringHelper";
import { IDataTransformer } from "./IDataTransformer";
import { utilConverter } from "./enumConverter";


@injectable()
export default class DataTransformer implements IDataTransformer {

  private DELIMITER: string = '.';


  private handleNested(target: any, splitField: any[], splitType: any[], value: any): any {
    const type = splitType[0];
    for (let i = 0; i < splitField.length; i++) {
      if (i === splitField.length - 1) {
        target[splitField[i]] = utilConverter.convertType(value, type);
      } else {
        if (!target[splitField[i]]) target[splitField[i]] = {};
        target = target[splitField[i]];
      }
    }
    return target;
  }
  
  private handleListType(target: any, splitField: any[], splitType: any[], value: any): any {
      const part = splitField[0];
      const index = Number(splitField[1]) - 1;
      const type = splitType[2];
      if (!target[part]) target[part] = [];
      target[part][index] = utilConverter.convertType(value, type);
    
    return target;
  }


  private handleListOfObjects(target: any, splitField: any[], splitType: any[], value: any): any {
    const part = splitField[0];
    const index = Number(splitField[1]) - 1;
    const type = splitType[2];
    if (!target[part]) target[part] = [];
    if (!target[part][index]) target[part][index] = {};
    target[part][index][splitField[2]] = utilConverter.convertType(value, type);
    return target;
  }

  

  public async transform(worksheet: any, col: number, config: any): Promise<any> {
    const jsonData: any = {};
    let recordName = '';

    for (let rowNumber = config.startRow; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);
      const cell = row.getCell(col);
      const value = cell.value instanceof Object && 'result' in cell.value ? cell.value.result : cell.value;
      const type = row.getCell(config.typeCol)?.value?.toString();
      const field = row.getCell(config.fieldCol)?.value?.toString();

        //skip the row if value is empty
      if (await StringeHelper.isEmpty(value)) { continue; }

      if (rowNumber === config.startRow) {
        recordName = value ?? '';
      } else if (rowNumber > config.startRow) {
        let target = jsonData;
        const splitType = type.split(this.DELIMITER);
        const splitField = field.split(this.DELIMITER);

        if (splitType.length === 1) {
          target = this.handleNested(target, splitField,splitType, value);
        }

        if (type === 'list.str' || type === 'list.num') {
          target = this.handleListType(target, splitField, splitType, value);
        }

        if (type === 'list.obj.str' || type === 'list.obj.num') {
          target = this.handleListOfObjects(target, splitField, splitType, value);
        }

      } //end else

    } //end for-loop
    return { recordName, jsonData };
  }
}


