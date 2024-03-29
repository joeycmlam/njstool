import * as fs from 'fs/promises';
import {Workbook, Worksheet} from "exceljs";


export default class JsonHelper {

    private workbook: Workbook;
    private data: any[];
    private inFileName: string;
    private outFileName: string;

    constructor() {
        this.workbook = new Workbook();
        this.data = [];
        this.inFileName = '';
        this.outFileName = '';
    }

    public async processJsonfile(fileName: string) {
        this.inFileName = fileName;
        try {
            // Check if the file exists
            await fs.access(this.inFileName);
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                throw new Error(`File not found: ${this.inFileName}`);
            } else {
                throw error;
            }
        }

        await this.readJson();
    }

    public getData(): any[] {
        return this.data;
    }

    private async readJson(): Promise<void> {
        const context = await fs.readFile(this.inFileName, 'utf8');
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

        try {
            // Check if the file exists, and if it does, delete it
            await fs.access(this.outFileName);
            await fs.unlink(this.outFileName);
            console.log(`Output file - ${this.outFileName} exists, deleting...`);
        } catch (error: any) {
            // Do nothing if the file doesn't exist
            if (error.code !== 'ENOENT') {
                console.error(`Error while checking or deleting the output file: ${error.message}`);
                throw error;
            }
        }
        await this.writeContext(worksheet);
    }


}
