export interface IDataTransformer {
    transform(worksheet: any, col: number, config: any): any;
  }