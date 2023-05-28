import * as XLSX from 'xlsx';


export enum enmTxnType {
    Buy = 'BUY',
    Sell = 'SELL'
}

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

    public async feeCalculator(order: Partial<Transaction>, data: Partial<Transaction>[]): Promise<number> {
        if (order.tradeDate === undefined  || order.unit === undefined || order.acctId === undefined) {
            console.error(JSON.stringify(order, null, 2));
            throw new Error('Required properties are missing from the order object');
        }

        const buyTransactions = data.filter(txn => txn.acctId === order.acctId && txn.fundId === order.fundId );
        buyTransactions.sort((a, b) => new Date(order.tradeDate ?? '').getTime() - new Date(order.tradeDate ?? '').getTime());

        for (const txn of buyTransactions) {
            if (txn.unit === undefined || txn.processDate === undefined) {
                throw new Error('Required properties are missing from txn object');
            }

            if (txn.unit >= order.unit) {
                const sellDate = new Date();
                const purchaseDate = new Date(txn.processDate);
                const timeDifference = Math.abs(sellDate.getTime() - purchaseDate.getTime());
                const yearDiff = Math.ceil(timeDifference / (1000 * 3600 * 24 * 30 * 12));

                const feePercentage = this.getFeePercentage(yearDiff);
                const fee = order.unit * feePercentage;

                return fee;
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

    public async readTransactionsFromFile(filePath: string): Promise< Partial<Transaction> []> {
        const workbook = XLSX.readFile(filePath);
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

        const data: Partial<Transaction>[] = XLSX.utils.sheet_to_json(worksheet, { header: columnHeaders, range: 1 });

        // Helper function to format date object to "yyyy-mm-dd" string
        const formatDate = (date: Date) => {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        };

        // Function to convert Excel date (number of days from 1900-01-01) to JavaScript Date object
        const excelDateToDate = (excelDate: number) => {
            const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000); // 25567 is the number of days from 1900-01-01 to 1970-01-01, and we add 2 to account for Excel incorrectly treating 1900 as a leap year
            return date;
        };

        // Map over the data array and format tradeDate property
        const formattedData = data.map(item => ({
            ...item,
            tradeDate: typeof item.tradeDate === 'number' ? formatDate(excelDateToDate(item.tradeDate)) : item.tradeDate,
        }));

        return formattedData;
    }
}

