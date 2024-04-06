

export default class StringeHelper {

    public static async isEmpty(value: any): Promise<boolean> {
        return value === undefined || value === null || (typeof value === 'string' && value.length === 0);
      }


}