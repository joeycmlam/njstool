import { injectable } from "inversify";
import StringeHelper from "../lib/stringHelper";
import { IDataTransformer } from "./IDataTransformer";
import { enmFieldType } from "./enmTypes";
import { utilConverter } from "./enumConverter";

@injectable()
export default class DataTransformerv2 implements IDataTransformer {

  private DELIMITER: string = '.';

  private handledNestedField(target: any): any {
    return target;
  }

  private handleNestedRecord(target: any, splitField: string[], type: string, value: any, index: number = 0): any {
    let fieldTarget: any = target; // Initialize fieldTarget to target

    splitField.forEach((field, i) => {
      if (i === splitField.length - 1) {
        if (isNaN(Number(field))) {
          fieldTarget[field] = utilConverter.convertType(value, type);
        } else {
          fieldTarget[Number(field) - 1] = utilConverter.convertType(value, type);
        }
      } else {
        if (!fieldTarget[field]) {
          if (isNaN(Number(splitField[i + 1]))) {
            fieldTarget[field] = {};
          } else {
            fieldTarget[field] = [];
          }
        }
        // Check if fieldTarget[field] is null or undefined before setting a property on it
        if (fieldTarget[field]) {
          fieldTarget = fieldTarget[field];
        } else {
          throw new Error(`Cannot set property '${field}' of null or undefined`);
        }
      }
    });

    return target;
  }



  public async transform(worksheet: any, col: number, config: any): Promise<any> {
    const jsonData: any = {};
    let recordName = worksheet.getRow(config.startRow).getCell(col).value.toString();

    for (let rowNumber = config.startRow + 1; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);
      const cell = row.getCell(col);
      const value = cell.value instanceof Object && 'result' in cell.value ? cell.value.result : cell.value;
      const type = row.getCell(config.typeCol)?.value?.toString();
      const field = row.getCell(config.fieldCol)?.value?.toString();

      if (field && type) {
        const splitField = field.split(this.DELIMITER);
        this.handleNestedRecord(jsonData, splitField, type, value);
      }
    }

    return { recordName, jsonData };
  }
}