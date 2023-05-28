
export default class dateHelper {
    public static monthDifference(date1: Date, date2: Date ): number {
        const months1 = date1.getFullYear() * 12 + date1.getMonth();
        const months2 = date2.getFullYear() * 12 + date2.getMonth();

        return Math.abs(months1 - months2);
    }

    public static excelDateToDate  (excelDate: number)  {
        const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000); // 25567 is the number of days from 1900-01-01 to 1970-01-01, and we add 2 to account for Excel incorrectly treating 1900 as a leap year
        return date;
    };

    public static  formatDate (date: Date, format: string) {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const value :string = format.replace('yyyy',yyyy.toString()).replace('mm', mm).replace('dd', dd);
        return `${value}`;
    };

}
