
import { Workbook } from "exceljs";

export default class excelHelper {
    public static async readWorkbookContent(filePath: string, worksheetName: string): Promise<string[][]> {
        const workbook = new Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.getWorksheet(worksheetName);
        const content: string[][] = [];

        if (worksheet) {
            worksheet.eachRow((row, rowIndex) => {
                const rowData: string[] = [];
                row.eachCell((cell, cellIndex) => {
                    rowData.push(cell.value?.toString() || '');
                });
                content.push(rowData);
            });
        }

        return content;
    }

    public async read(filePath: string): Promise<Workbook> {
        const workbook = new Workbook();
        await workbook.xlsx.readFile(filePath);
        return workbook;
    }

}
