import * as fs from 'fs';
import {Workbook, Worksheet} from "exceljs";


export default class JsonHelper {


    private workbook = new Workbook();
    private data: any[] = [];
    private inFileName: string = '';
    private outFileName: string = '';

    constructor() {

    }

    public async processJsonfile(fileName: string) {
        this.inFileName = fileName;
        await this.readJson();
    }
    private async readJson(): Promise<void> {
        const context = fs.readFileSync(this.inFileName, 'utf8');
        this.data = await JSON.parse(context);
        console.log(`row count: [${this.data.length}]`)
    }

    private flatten(obj: any, prefix: string = '', result: any = {}): any {
        return Object.entries(obj).reduce((accumulator, [key, value]) => {
            const newKey = prefix ? `${prefix}.${key}` : key;

            if (typeof value === 'object' && value !== null) {
                return this.flatten(value, newKey, accumulator);
            } else {
                accumulator[newKey] = value;
                return accumulator;
            }
        }, result);
    }


    private async writeHeader(worksheet: Worksheet): Promise<void> {
        if (this.data.length === 0) { return; }

        const headerRow = this.data[0];
        const flattenedHeaderRow = this.flatten(headerRow);

        worksheet.columns = Object.keys(flattenedHeaderRow).map((key) => {
            return {header: key, key: key};
        });
    }

    private async writeContext(worksheet: Worksheet): Promise<void> {


        await this.writeHeader(worksheet);
        for (const item of this.data) {
            const flattenedItem = this.flatten(item)
            worksheet.addRow(flattenedItem);
        }
        this.workbook.xlsx.writeFile(this.outFileName);
    }

    public async write2excel(outputFile: string, sheetName: string): Promise<void> {
        const worksheet= this.workbook.addWorksheet(sheetName);
        this.outFileName = outputFile;
        await this.writeContext(worksheet);
    }


}
