
import {Workbook} from "exceljs";
export default class excelHelper {
    public  static async readWorkbookContent(filePath: string): Promise<string[][]> {
        const workbook = new Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.getWorksheet(1);
        const content: string[][] = [];

        worksheet.eachRow((row, rowIndex) => {
            const rowData: string[] = [];
            row.eachCell((cell, cellIndex) => {
                rowData.push(cell.value?.toString() || '');
            });
            content.push(rowData);
        });

        return content;
    }
}
