import * as XLSX from 'xlsx';


export enum enmTxnType {
    Buy = 'BUY',
    Sell = 'SELL'
};

export interface Transaction {
    txnId: number;
    acctId: string;
    txnSeq: number;
    txnType: enmTxnType;
    tradeDate: string;
    fundId: string;
    valnDate: string;
    unit: number;
    processDate: string;
    unitCost: number;
    purchaseDate: string;
}

export default class FeeCalculator {
    private feeSchedule: number[];

    constructor() {
        this.feeSchedule = [0.03, 0.02, 0.01];
    }

    private getFeePercentage(year: number): number {
        if (year < 1) {
            throw new Error("Month must be 1 or greater.");
        }

        if (year <= this.feeSchedule.length) {
            return this.feeSchedule[year - 1];
        }

        return 0;
    }

    public feeCalculator(order: Partial<Transaction>, data: Transaction[]): number {
        if (order.tradeDate === undefined  || order.unit === undefined) {
            throw new Error('Required properties are missing from the order object');
        }

        const buyTransactions = data.filter(txn => txn.acctId === order.acctId && txn.fundId === order.fundId && txn.txnType === enmTxnType.Buy);
        buyTransactions.sort((a, b) => new Date(a.tradeDate).getTime() - new Date(b.tradeDate).getTime());

        for (const txn of buyTransactions) {
            if (txn.unit >= order.unit) {
                const sellDate = new Date();
                const purchaseDate = new Date(txn.processDate);
                const timeDifference = Math.abs(sellDate.getTime() - purchaseDate.getTime());
                const yearDiff = Math.ceil(timeDifference / (1000 * 3600 * 24 * 30 * 12));

                const feePercentage = this.getFeePercentage(yearDiff);
                const fee = order.unit * feePercentage;

                return 0;
            }
        }

        return 0;
    }


    public calculateFee(order: Partial<Transaction> ): number {
        if (order.tradeDate === undefined || order.purchaseDate === undefined || order.unit === undefined) {
            throw new Error('Required properties are missing from the order object');
        }

        const sellDateObj = new Date(order.tradeDate);
        const purchaseDateObj = new Date(order.purchaseDate);
        const timeDifference = Math.abs(sellDateObj.getTime() - purchaseDateObj.getTime());
        const yearDiff = Math.ceil(timeDifference / (1000 * 3600 * 24 * 30 * 12));

        const feePercentage = this.getFeePercentage(yearDiff);
        return (order.unit  * feePercentage);
    }

    public async readTransactionsFromFile(filePath: string): Promise<Transaction[]> {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        return XLSX.utils.sheet_to_json(worksheet, {header: 'A'});
    }
}

