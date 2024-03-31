import {readFile} from "fs/promises";
import { read, utils } from 'xlsx';
import {iDataReader} from "../app-interface/iETL";
import Logger from "./logger";

export default class ExcelReader implements iDataReader{
    private fileFullName: string;
    private logger = Logger.getLogger();

    constructor(filePath: string) {
        this.fileFullName = filePath;

    }

    private async _readWorkbook() {
        try {
            this.logger.log(`Reading file: ${this.fileFullName}`);
            const buffer = await readFile(this.fileFullName);
            return read(buffer, { type: 'buffer' });
        } catch {
            this.logger.error(`Error while reading file: ${this.fileFullName}`);
            return null;
        }
        
    }

    public async extractData(sheetIndex = 0): Promise<any[]> {
        try {
            const workbook = await this._readWorkbook();
            if (workbook === null) {
                throw new Error(`Workbook [${this.fileFullName}] is null`);
            }
            const sheetName = workbook.SheetNames[sheetIndex];
            const worksheet = workbook.Sheets[sheetName];
            return utils.sheet_to_json(worksheet);
        } catch (error: any) {
            this.logger.error(`Error while processing file: ${error.message}`);
            return [];
        }
    }
}
