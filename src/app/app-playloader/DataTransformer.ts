import { injectable } from "inversify";

enum FieldType {
  NUMBER = 'num',
  STRING = 'str',
  BOOLEAN = 'boolean',
  LIST = 'list',
  OBJECT = 'obj'
}

@injectable()
export default class DataTransformer {

  private DELIMITER: string = '.';

  private convertType(value: any, type: string): any {
    if (type === FieldType.NUMBER) {
      return Number(value);
    } else if (type === FieldType.STRING) {
      return String(value);
    } else if (type === FieldType.BOOLEAN) {
      return Boolean(value);
    } else {
      return value;
    }
  }

  private handleNested(target: any, splitField: any[], splitType: any[], value: any): any {
    const type = splitType[0];
    for (let i = 0; i < splitField.length; i++) {
      if (i === splitField.length - 1) {
        target[splitField[i]] = this.convertType(value, type);
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
      target[part][index] = this.convertType(value, type);
    
    return target;
  }


  private handleListOfObjects(target: any, splitField: any[], splitType: any[], value: any): any {
    const part = splitField[0];
    const index = Number(splitField[1]) - 1;
    const type = splitType[2];
    if (!target[part]) target[part] = [];
    if (!target[part][index]) target[part][index] = {};
    target[part][index][splitField[2]] = this.convertType(value, type);
    return target;
  }

  public transform(worksheet: any, col: number, config: any): any {
    const jsonData: any = {};
    let recordName = '';

    for (let rowNumber = config.startRow; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);
      const cell = row.getCell(col);
      const value = cell.value instanceof Object && 'result' in cell.value ? cell.value.result : cell.value;
      const type = row.getCell(config.typeCol)?.value?.toString();
      const field = row.getCell(config.fieldCol)?.value?.toString();

        //skip the row if value is empty
      if (value === undefined || value === null || (typeof value === 'string' && value.length === 0)) { continue; }

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


