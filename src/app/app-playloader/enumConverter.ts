import { enmFieldType } from './enmTypes';

export class utilConverter {

  public static convertType(value: any, type: string): any {
    if (type === enmFieldType.NUMBER) {
      return Number(value);
    } else if (type === enmFieldType.STRING) {
      return String(value);
    } else if (type === enmFieldType.BOOLEAN) {
      return Boolean(value);
    } else {
      return value;
    }
  }
}