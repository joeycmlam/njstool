import * as XLSX from 'xlsx';

export interface Transaction {
    txnId: number;
    acctId: string;
    txnSeq: number;
    txnType: string;
    tradeDate: string;
    fundId: string;
    valnDate: string;
    txnUnit: number;
    processDate: string;
    unitCost: number;
}

export default class FeeCalculator {
    private feeSchedule: number[];

    constructor() {
        this.feeSchedule = [0.03, 0.02, 0.01];
    }

    private getFeePercentage(month: number): number {
        if (month < 1) {
            throw new Error("Month must be 1 or greater.");
        }

        if (month <= this.feeSchedule.length) {
            return this.feeSchedule[month - 1];
        }

        return 0;
    }

    public calculateFee(sellDate: string, purchaseDate: string, units: number): number {
        const sellDateObj = new Date(sellDate);
        const purchaseDateObj = new Date(purchaseDate);
        const timeDifference = Math.abs(sellDateObj.getTime() - purchaseDateObj.getTime());
        const monthDifference = Math.ceil(timeDifference / (1000 * 3600 * 24 * 30));

        const feePercentage = this.getFeePercentage(monthDifference);
        return units * feePercentage;
    }

    public async readTransactionsFromFile(filePath: string): Promise<Transaction[]> {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        return XLSX.utils.sheet_to_json(worksheet, {header: 'A'});
    }
}

