import { injectable } from "inversify";

@injectable()
export default class DataTransformer {
  private COL_FIELD: number = 1;
  private COL_TYPE: number = 2;

  public transform(worksheet: any, col: number): any {
    const jsonData: any = {};
    let recordName = '';

    for (let col = 3; col <= worksheet.actualColumnCount; col++) {
      const jsonData: any = {};
      let recordName = '';

      worksheet.eachRow((row: any, rowNumber: number) => {
        if (rowNumber === 1) {
          recordName = row.getCell(col)?.value?.toString() ?? '';
        } else {
          const field = row.getCell(this.COL_FIELD)?.value?.toString();
          const type = row.getCell(this.COL_TYPE)?.value?.toString();
          const value = row.getCell(col).value;

          let target = jsonData;
          const splitField = field?.split('.');
          splitField?.forEach((part: any, index: Number) => {
            if (index === splitField.length - 1) {
              if (type?.startsWith('list')) {
                if (!target[part]) target[part] = [];
                target[part].push(value);
              } else {
                target[part] = type === 'num' ? Number(value) : String(value);
              }
            } else {
              if (!target[part]) target[part] = {};
              target = target[part];
            }
          });
        }
      });


      return { recordName, jsonData };
    }
  }
}