import { injectable } from "inversify";

@injectable()
export default class DataTransformer {
  private COL_FIELD: number = 1;
  private COL_TYPE: number = 2;
  private DELIMITER: string = '.';
  private COL_START: number = 3;

  public transform(worksheet: any, col: number): any {
    const jsonData: any = {};
    let recordName = '';

    worksheet.eachRow((row: any, rowNumber: number) => {
      if (rowNumber === 1) {
        recordName = row.getCell(col)?.value?.toString() ?? '';
      } else {
        // const field = row.getCell(this.COL_FIELD)?.value?.toString();
        // const type = row.getCell(this.COL_TYPE)?.value?.toString();
        const value = row.getCell(col).value;

        let target = jsonData;
        const splitType = row.getCell(this.COL_TYPE)?.value?.toString()?.split(this.DELIMITER);
        const type = splitType[0];

        const splitField = row.getCell(this.COL_FIELD)?.value?.toString()?.split(this.DELIMITER);
        if (splitType?.length === 1) {
          splitField?.forEach((part: any, index: Number) => {
            if (index === splitField.length - 1) {
              target[part] = type === 'num' ? Number(value) : String(value);
            } else {
              if (!target[part]) target[part] = {};
              target = target[part];

            }
          });
        } else { // list
          splitField?.forEach((part: any, index: Number) => {
            if (index === splitField.length - 2) {
              if (!target[part]) target[part] = [];
              target[part].push(type === 'num' ? Number(value) : String(value));
            }
          });
        }

      }
    });

    return { recordName, jsonData };
  }

  private isEmpty(value: any): boolean {
    const rtnvalue: boolean = value === undefined || value === null || value === '';
    return rtnvalue;
  }
}