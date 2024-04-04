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


  private handleNested(target: any, splitField: any[], splitType: any[], value: any): any {
    const type = splitType[0];
    for (let i = 0; i < splitField.length; i++) {
      if (i === splitField.length - 1) {
        target[splitField[i]] = type === 'num' ? Number(value) : String(value);;
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
      target[part][index] = type === 'num' ? Number(value) : String(value);
    
    return target;
  }


  private handleListOfObjects(target: any, splitField: any[], splitType: any[], value: any): any {
    const part = splitField[0];
    const index = Number(splitField[1]) - 1;
    const type = splitType[2];
    if (!target[part]) target[part] = [];
    if (!target[part][index]) target[part][index] = {};
    target[part][index][splitField[2]] = type === 'num' ? Number(value) : String(value);
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
      if (!value) { continue; }

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


