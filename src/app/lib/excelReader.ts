import {readFile} from "fs/promises";
import { read, utils } from 'xlsx';

export default class ExcelReader {
    private filePath: string;
    constructor(filePath: string) {
        this.filePath = filePath;
    }

    async _readWorkbook() {
        const buffer = await readFile(this.filePath);
        return read(buffer, { type: 'buffer' });
    }

    async extractData(sheetIndex = 0) {
        const workbook = await this._readWorkbook();
        const sheetName = workbook.SheetNames[sheetIndex];
        const worksheet = workbook.Sheets[sheetName];
        return utils.sheet_to_json(worksheet);
    }
}
