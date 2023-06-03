import * as XLSX from 'xlsx';
import dateHelper from "../lib/dateHelper";
import * as fs from "fs/promises";

export enum enmTxnType {
    Buy = 'BUY',
    Sell = 'SELL'
}

export interface Transaction {
    txnId: number;
    acctId: string;
    txnSeq: number;
    txnType: enmTxnType;
    tradeDate: Date;
    fundId: string;
    valnDate: Date;
    unit: number;
    processDate: Date;
    unitCost: number;
    purchaseDate: Date;
}

type FeeRate = {
    lowerBound: number;
    upperBound: number;
    rate: number;
};

export default class FeeCalculator {
    // private logger;
    private feeSchema: number[] = [0.03, 0.02, 0.01];
    private feeRates: FeeRate[];

    constructor(feeRates: FeeRate[]=[
        { "lowerBound": 0, "upperBound": 1000000, "rate": 0.03 },
        { "lowerBound": 1000000, "upperBound": 3000000, "rate": 0.02 },
        { "lowerBound": 3000000, "upperBound": Infinity, "rate": 0.01 }
    ]) {
        this.feeRates = feeRates;
    }


    private getFeeRate(aum: number, feeRates: FeeRate[]): number {
        for (const feeRate of feeRates) {
            if (aum >= feeRate.lowerBound && aum < feeRate.upperBound) {
                return feeRate.rate;
            }
        }
        throw new Error('No fee rate found for the specified AUM.');
    }

    public calcFeeByAUM(aum: number): number {
        return aum * this.getFeeRateByAum(aum);
    }
    private getFeeRateByAum(aum: number): number {
        for (const feeRate of this.feeRates) {
            if (aum >= feeRate.lowerBound && aum < feeRate.upperBound) {
                return feeRate.rate;
            }
        }
        throw new Error('No fee rate found for the specified AUM.');
    }

    private getFeeRateByYear(months: number): number {
        const years : number = Math.floor(months / 12);

        if (years < 1) {
            return this.feeSchema[0];
        }

        if (years <= this.feeSchema.length) {
            return this.feeSchema[years - 1];
        }

        return 0;
    }

    private async getHeldTransactionUnits(transactions: Partial<Transaction>[]): Promise<Partial<Transaction> []> {
        const buyTransactions: Partial<Transaction> [] = [];
        let sellQuantity = 0;

        for (const txn of transactions) {
            if (txn.unit === undefined) {
                console.error(JSON.stringify(txn));
                throw new Error('getHeldTransaction:s Required properties are missing from the order object')
            }
            if (txn.txnType === 'SELL') {
                sellQuantity += Math.abs(txn.unit);
            } else if (txn.txnType === 'BUY') {
                const adjustedQuantity = Math.max(0, txn.unit - sellQuantity);
                sellQuantity = Math.max(0, sellQuantity - txn.unit);
                if (adjustedQuantity > 0) {
                    buyTransactions.push({ ...txn, unit: adjustedQuantity });
                }
            }
        }

        return buyTransactions;
    }


    public async feeCal(order: Partial<Transaction>, data: Partial<Transaction>[]): Promise<number> {
        if (order.tradeDate === undefined || order.unit === undefined || order.acctId === undefined) {
            console.error(JSON.stringify(order, null, 2));
            throw new Error('feeCalculator: Required properties are missing from the order object');
        }

        const transactions = data.filter(txn => txn.acctId === order.acctId && txn.fundId === order.fundId);
        transactions.sort((a, b) => new Date(a.tradeDate ?? '').getTime() - new Date(b.tradeDate ?? '').getTime());


        const buyTransactions: Partial<Transaction>[] = await this.getHeldTransactionUnits(transactions);

        // Calculate fees for buy transactions
        let remainingUnits = order.unit;
        let totalFee = 0;
        let buyIndex = 0;

        while (remainingUnits > 0 && buyIndex < buyTransactions.length) {
            const txn = buyTransactions[buyIndex];
            if (txn.tradeDate === undefined) {
                console.error(JSON.stringify(txn));
                throw new Error('Required properties are missing from buy txn object');
            }
            const unitsToProcess = Math.min(remainingUnits, txn.unit ?? 0);
            const monthDiff = dateHelper.monthDifference(order.tradeDate, txn.tradeDate);

            const feePercentage = this.getFeeRateByYear(monthDiff);
            const fee = unitsToProcess * feePercentage;

            totalFee += fee;
            remainingUnits -= unitsToProcess;

            if (txn.unit !== undefined) {
                txn.unit -= unitsToProcess;
            }

            if ((txn.unit ?? 0) <= 0) {
                buyIndex++;
            }
        }

        return totalFee;
    }

    public calculateFee(order: Partial<Transaction> ): number {
        if (order.tradeDate === undefined || order.purchaseDate === undefined || order.unit === undefined) {
            console.error(JSON.stringify(order));
            throw new Error('calculateFee: Required properties are missing from the order object');
        }

        const monthDiff : number = dateHelper.monthDifference(order.purchaseDate, order.tradeDate);

        const feePercentage = this.getFeeRateByYear(monthDiff);
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

