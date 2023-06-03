import * as XLSX from "xlsx";
import dateHelper from "../lib/dateHelper";
import {Transaction} from "./feeCalculator";

export default class TransactionLoader {

    private fileName: string;
    private txn: Transaction[] = [];

    constructor(file: string = './transaction.xlsx') {
        this.fileName = file;
    }


    public getTransaction(): Transaction[] {
        return this.txn;

    }

    public async readTransactionsFromFile(): Promise<Partial<Transaction> []> {
        const workbook = XLSX.readFile(this.fileName);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const columnHeaders = [
            'txnId',
            'acctId',
            'txnSeq',
            'txnType',
            'tradeDate',
            'fundId',
            'valnDate',
            'unit',
            'processDate',
            'unitCost'
        ];

        const data: Partial<Transaction>[] = XLSX.utils.sheet_to_json(worksheet, {header: columnHeaders, range: 1});


        // Map over the data array and format tradeDate property
        const formattedData = data.map(item => ({
            ...item,
            tradeDate: typeof item.tradeDate === 'number' ? dateHelper.excelDateToDate(item.tradeDate) : item.tradeDate,
            valnDate: typeof item.valnDate === 'number' ? dateHelper.excelDateToDate(item.valnDate) : item.valnDate,
            processDate: typeof item.processDate === 'number' ? dateHelper.excelDateToDate(item.processDate) : item.processDate
        }));

        return formattedData;
    }
}
