import { injectable } from "inversify";
import StringeHelper from "../lib/stringHelper"; 

@injectable()
export default class DataTransformerv2 {

    private DELIMITER: string = '.';

    private handleNestedRecord(target: any, splitField: string[], splitType: string[], value: any, index: number = 0): any {
        const part = splitField[index];
        const type = splitType[0];
      
        if (index === splitField.length - 1) {
          if (type === 'list') {
            const idx = parseInt(part, 10);
            if (!target[idx]) {
              target[idx] = value;
            }
          } else if (type === 'obj') {
            if (!target[part]) {
              target[part] = value;
            }
          } else {
            target[part] = value;
          }
        } else {
          if (type === 'list') {
            const idx = parseInt(part, 10);
            if (!target[idx]) {
              target[idx] = [];
            }
            this.handleNestedRecord(target[idx], splitField, splitType, value, index + 1);
          } else if (type === 'obj') {
            if (!target[part]) {
              target[part] = {};
            }
            this.handleNestedRecord(target[part], splitField, splitType, value, index + 1);
          }
        }
      
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
          if (await StringeHelper.isEmpty(value)) { continue; }
    
          if (rowNumber === config.startRow) {
            recordName = value ?? '';
          } else if (rowNumber > config.startRow) {
            let target = jsonData;
            const splitType = type.split(this.DELIMITER);
            const splitField = field.split(this.DELIMITER);
    
            this.handleNestedRecord(target, splitField, splitType, value);
    
          } //end else
    
        } //end for-loop
        return { recordName, jsonData };
        
}