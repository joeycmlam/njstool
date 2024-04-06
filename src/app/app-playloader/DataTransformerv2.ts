import { injectable } from "inversify";
import { IDataTransformer } from "./IDataTransformer";
import { utilConverter } from "./enumConverter";

@injectable()
export default class DataTransformerv2 implements IDataTransformer {

  private DELIMITER: string = '.';


  private handleNestedRecord(target: any, splitField: string[], type: string, value: any): any {
    let fieldTarget: any = target; // Initialize fieldTarget to target
    const lastIndex = splitField.length - 1;

    splitField.forEach((field, i) => {
      if (i === lastIndex) {
        fieldTarget[field] = utilConverter.convertType(value, type);
      } else {
        let nextFieldTarget = fieldTarget[field]; // Store this in a variable to avoid repeated property access
        if (!nextFieldTarget) {
          if (isNaN(Number(splitField[i + 1]))) {
            nextFieldTarget = {};
          } else {
            nextFieldTarget = [];
          }
          fieldTarget[field] = nextFieldTarget;
        }
        fieldTarget = nextFieldTarget;
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