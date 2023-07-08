import LoggerFactory, { LoggerOptions } from "../lib/logger";

export enum enumTnxType {
    SUBSCRIPTION = "SUB",
    REDEMPTION = "REM",
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
    soldUnits: number;
    deductedUnits: number;
};

export default class FIFOHoldingPeriodCalculator {
    private logger: any;
    public constructor(private transactions: InvestmentTransaction[]) {
        const loggerFactory = LoggerFactory.getInstance("src/app/app-fee/config.yaml");
        this.logger = loggerFactory.getLogger();
    }

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
                    units: transaction.units,
                    holdingPeriod,
                    soldUnits: 0,
                    deductedUnits: 0,
                });
            } else if (transaction.transactionType === enumTnxType.REDEMPTION) {
                remainingUnits -= transaction.units;

                // Update soldUnits and deductedUnits in the holding periods array (FIFO)
                while (transaction.units > 0 && holdingPeriods.length > 0) {
                    const firstHoldingPeriod = holdingPeriods[0];
                    if (transaction.units >= firstHoldingPeriod.units - firstHoldingPeriod.soldUnits) {
                        const deducted = firstHoldingPeriod.units - firstHoldingPeriod.soldUnits;
                        transaction.units -= deducted;
                        firstHoldingPeriod.soldUnits = firstHoldingPeriod.units;
                        holdingPeriods.shift();
                    } else {
                        firstHoldingPeriod.soldUnits += transaction.units;
                        transaction.units = 0;
                    }
                }
            }
        }

        this.logger.info(holdingPeriods);

        // Calculate holding periods for the specified number of selling units
        const sellingHoldingPeriods: HoldingPeriod[] = [];
        while (sellingUnits > 0 && holdingPeriods.length > 0) {
            const firstHoldingPeriod = holdingPeriods[0];
            if (sellingUnits >= firstHoldingPeriod.units - firstHoldingPeriod.soldUnits) {
                const deducted = firstHoldingPeriod.units - firstHoldingPeriod.soldUnits;
                sellingUnits -= deducted;
                firstHoldingPeriod.soldUnits = firstHoldingPeriod.units;
                firstHoldingPeriod.deductedUnits = deducted;
                sellingHoldingPeriods.push(holdingPeriods.shift() as HoldingPeriod);
            } else {
                const partialHoldingPeriod = { ...firstHoldingPeriod, soldUnits: firstHoldingPeriod.soldUnits + sellingUnits };
                partialHoldingPeriod.deductedUnits = sellingUnits;
                sellingHoldingPeriods.push(partialHoldingPeriod);
                firstHoldingPeriod.soldUnits += sellingUnits;
                sellingUnits = 0;
            }
        }

        return sellingHoldingPeriods;
    }
}
