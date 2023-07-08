
export enum enumTnxType {
    SUBSCRIPTION = 'SUB',
    REDEMPTION = 'REM'
}
// Define a type for Investment Transaction
export type InvestmentTransaction = {
    txnDate: Date;
    units: number;
    transactionType: enumTnxType;
};

export default class FIFOHoldingPeriodCalculator {
    constructor(private transactions: InvestmentTransaction[]) {}

    // Calculate holding periods for each unit based on the FIFO method
    calculateHoldingPeriods(
        referenceDate: Date = new Date(),
        sellingUnits: number
    ): number[] {
        const holdingPeriods: number[] = [];

        const sortedTransactions = this.transactions
            .slice()
            .sort((a, b) => a.txnDate.getTime() - b.txnDate.getTime());
        let remainingUnits = 0;

        for (const transaction of sortedTransactions) {
            if (transaction.transactionType === enumTnxType.SUBSCRIPTION) {
                remainingUnits += transaction.units;

                // Calculate holding period for each unit in the transaction
                for (let i = 0; i < transaction.units; i++) {
                    const holdingPeriod =
                        (referenceDate.getTime() - transaction.txnDate.getTime()) /
                        (1000 * 60 * 60 * 24 * 365);
                    holdingPeriods.push(holdingPeriod);
                }
            } else if (transaction.transactionType === enumTnxType.REDEMPTION) {
                remainingUnits -= transaction.units;

                // Remove units from the holding periods array (FIFO)
                for (let i = 0; i < transaction.units; i++) {
                    holdingPeriods.shift();
                }
            }
        }

        // Calculate holding periods for the specified number of selling units
        const sellingHoldingPeriods: number[] = [];
        for (let i = 0; i < sellingUnits; i++) {
            if (holdingPeriods.length > 0) {
                sellingHoldingPeriods.push(holdingPeriods.shift() as number);
            } else {
                break;
            }
        }

        return sellingHoldingPeriods;
    }
}
