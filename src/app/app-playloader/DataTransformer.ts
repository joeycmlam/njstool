import { injectable } from "inversify";

@injectable()
export default class DataTransformer {

  private DELIMITER: string = '.';

  public transform(worksheet: any, col: number, config: any): any {
    const jsonData: any = {};
    let recordName = '';
    const COL_FIELD: number = config.fieldCol;
    const COL_TYPE: number = config.typeCol;

    for (let rowNumber = config.startRow; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);
      const value = row.getCell(col).value;

      if (!value) { continue; }

      if (rowNumber === 1) {
        recordName = value ?? '';
      } else {
        let target = jsonData;
        const splitType = row.getCell(COL_TYPE)?.value?.toString()?.split(this.DELIMITER);
        const type = splitType[0];
        const splitField = row.getCell(COL_FIELD)?.value?.toString()?.split(this.DELIMITER);

        splitField?.forEach((part: any, index: Number) => {
          if (splitType?.length === 1) {
            if (index === splitField.length - 1) {
              target[part] = type === 'num' ? Number(value) : String(value);
            } else {
              if (!target[part]) target[part] = {};
              target = target[part];
            }
          }

          if (splitType?.length === 2) {
            if (index === splitField.length - 2) {
              if (!target[part]) target[part] = [];
              target[part].push(type === 'num' ? Number(value) : String(value));
            }
          }
        });

      }
    } //end for-loop
    return { recordName, jsonData };
  }
}