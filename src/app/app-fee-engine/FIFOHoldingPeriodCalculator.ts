import {CalcuatedFeeTransaction, InvestmentTransaction} from "./typeFeeEngine";
import {enumTnxType} from "./enumFeeEngine";



export default class FIFOHoldingPeriodCalculator {
    private logger: any;
    public constructor(private transactions: InvestmentTransaction[]) {
    }

    // Calculate holding periods for each unit based on the FIFO method
    public calculateHoldingPeriods(
        referenceDate: Date = new Date(),
        sellingUnits: number
    ): CalcuatedFeeTransaction[] {
        const holdingPeriods: CalcuatedFeeTransaction[] = [];

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
                    txnDetail: transaction,
                    holdingPeriod,
                    soldUnits: 0,
                    deductedUnits: 0,
                });
            } else if (transaction.transactionType === enumTnxType.REDEMPTION) {
                remainingUnits -= transaction.units;

                // Update soldUnits and deductedUnits in the holding periods array (FIFO)
                while (transaction.units > 0 && holdingPeriods.length > 0) {
                    const firstHoldingPeriod = holdingPeriods[0];
                    if (transaction.units >= firstHoldingPeriod.txnDetail.units - firstHoldingPeriod.soldUnits) {
                        const deducted = firstHoldingPeriod.txnDetail.units - firstHoldingPeriod.soldUnits;
                        transaction.units -= deducted;
                        firstHoldingPeriod.soldUnits = firstHoldingPeriod.txnDetail.units;
                        holdingPeriods.shift();
                    } else {
                        firstHoldingPeriod.soldUnits += transaction.units;
                        transaction.units = 0;
                    }
                }
            }
        }

        // this.logger.debug(holdingPeriods);

        // Calculate holding periods for the specified number of selling units
        const sellingHoldingPeriods: CalcuatedFeeTransaction[] = [];
        while (sellingUnits > 0 && holdingPeriods.length > 0) {
            const firstHoldingPeriod = holdingPeriods[0];
            if (sellingUnits >= firstHoldingPeriod.txnDetail.units - firstHoldingPeriod.soldUnits) {
                const deducted = firstHoldingPeriod.txnDetail.units - firstHoldingPeriod.soldUnits;
                sellingUnits -= deducted;
                firstHoldingPeriod.soldUnits = firstHoldingPeriod.txnDetail.units;
                firstHoldingPeriod.deductedUnits = deducted;
                sellingHoldingPeriods.push(holdingPeriods.shift() as CalcuatedFeeTransaction);
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
