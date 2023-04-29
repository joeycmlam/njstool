import * as fs from 'fs';
import {Workbook, Worksheet} from "exceljs";
import {typeHelpder} from "../lib/typeHelper";


export default class JsonHelper {


    private workbook = new Workbook();

    private _data: any;
    private _fileName: string = '';

    get data() {
        return this._data;
    }

    constructor() {

    }

    public async processJsonfile(fileName: string) {
        this._fileName = fileName;
        await this.readJson();
    }
    private async readJson(): Promise<void> {
        const context = fs.readFileSync(this._fileName, 'utf8');
        this._data = await JSON.parse(context);
    }


    private async writeContext(worksheet: Worksheet): Promise<void> {
        if (typeHelpder.isNull(this.data)) { return; }

        for (let record of this._data) {
            worksheet.addRow(record);
        }
    }

    public async write2excel(outputFile: string, sheetName: string): Promise<void> {
        const worksheet= this.workbook.addWorksheet(sheetName);
        await this.writeContext(worksheet);
        await this.workbook.xlsx.writeFile(outputFile);
    }


}
