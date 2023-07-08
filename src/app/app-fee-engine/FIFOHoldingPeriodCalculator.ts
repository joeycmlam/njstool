export enum enumTnxType {
    SUBSCRIPTION = 'SUB',
    REDEMPTION = 'REM',
}

// Define a type for Investment Transaction
export type InvestmentTransaction = {
    referenceId: string;
    txnDate: Date;
    units: number;
    transactionType: enumTnxType;
};

// Define a type for Holding Period
export type HoldingPeriod = {
    referenceId: string;
    txnDate: Date;
    holdingPeriod: number;
    units: number;
};

export default class FIFOHoldingPeriodCalculator {
    public constructor(private transactions: InvestmentTransaction[]) {}

    // Calculate holding periods for each unit based on the FIFO method
    public calculateHoldingPeriods(
        referenceDate: Date = new Date(),
        sellingUnits: number
    ): HoldingPeriod[] {
        const holdingPeriods: HoldingPeriod[] = [];

        const sortedTransactions = this.transactions
            .slice()
            .sort((a, b) => a.txnDate.getTime() - b.txnDate.getTime());
        let remainingUnits = 0;

        for (const transaction of sortedTransactions) {
            if (transaction.transactionType === enumTnxType.SUBSCRIPTION) {
                remainingUnits += transaction.units;

                // Calculate holding period for the transaction
                const holdingPeriod =
                    (referenceDate.getTime() - transaction.txnDate.getTime()) /
                    (1000 * 60 * 60 * 24 * 365);

                // Add transaction information to the holding period
                holdingPeriods.push({
                    referenceId: transaction.referenceId,
                    txnDate: transaction.txnDate,
                    holdingPeriod,
                    units: transaction.units,
                });
            } else if (transaction.transactionType === enumTnxType.REDEMPTION) {
                remainingUnits -= transaction.units;

                // Remove units from the holding periods array (FIFO)
                while (transaction.units > 0 && holdingPeriods.length > 0) {
                    const firstHoldingPeriod = holdingPeriods[0];
                    if (transaction.units >= firstHoldingPeriod.units) {
                        transaction.units -= firstHoldingPeriod.units;
                        holdingPeriods.shift();
                    } else {
                        firstHoldingPeriod.units -= transaction.units;
                        transaction.units = 0;
                    }
                }
            }
        }

        // Calculate holding periods for the specified number of selling units
        const sellingHoldingPeriods: HoldingPeriod[] = [];
        while (sellingUnits > 0 && holdingPeriods.length > 0) {
            const firstHoldingPeriod = holdingPeriods[0];
            if (sellingUnits >= firstHoldingPeriod.units) {
                sellingUnits -= firstHoldingPeriod.units;
                sellingHoldingPeriods.push(holdingPeriods.shift() as HoldingPeriod);
            } else {
                const partialHoldingPeriod = { ...firstHoldingPeriod, units: sellingUnits };
                sellingHoldingPeriods.push(partialHoldingPeriod);
                firstHoldingPeriod.units -= sellingUnits;
                sellingUnits = 0;
            }
        }

        return sellingHoldingPeriods;
    }
}
