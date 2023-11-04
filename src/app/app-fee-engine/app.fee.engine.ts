import DSCCalculator, {DSCSchedule} from "./DSCCalculator";
import {InvestmentTransaction} from "./typeFeeEngine";
import {enumTnxType} from "./enumFeeEngine";
import FIFOHoldingPeriodCalculator from "./FIFOHoldingPeriodCalculator";
import Logger from "../lib/logger";

class app {


    static async  process() {
        logger.info('process.start');
// Example usage:
        const transactions: InvestmentTransaction[] = [
            {referenceId: 'T00001', txnDate: new Date('2019-01-01'), units: 100, transactionType: enumTnxType.SUBSCRIPTION },
            {referenceId: 'T00002', txnDate: new Date('2020-06-01'), units: 50, transactionType: enumTnxType.SUBSCRIPTION},
            {referenceId: 'T00003', txnDate: new Date('2021-07-01'), units: 100, transactionType: enumTnxType.SUBSCRIPTION},
            {referenceId: 'T00004', txnDate: new Date('2022-01-01'), units: 120, transactionType: enumTnxType.REDEMPTION },
        ];

        const referenceDate = new Date('2023-07-08'); // The date to calculate holding periods
        const fifoHoldingPeriodCalculator = new FIFOHoldingPeriodCalculator(transactions);
        const holdingPeriods = fifoHoldingPeriodCalculator.calculateHoldingPeriods(referenceDate, 40);

        logger.info(`Holding periods:{$holdingPeriods}`);




        const dscSchedule: DSCSchedule = [
            { year: 1, percentage: 0.05 },
            { year: 2, percentage: 0.04 },
            { year: 3, percentage: 0.03 },
            { year: 4, percentage: 0.01 },
        ];

        const dscCalculator = new DSCCalculator(dscSchedule);

        const dscTransactions = dscCalculator.calculateDSC(holdingPeriods);
        logger.info(`The Deferred Sales Charge: JSON.stringify(dscTransactions)`);

        logger.info('process.end');
    }
}

const logger = Logger.getInstance();

(async () => {

    logger.info('start');

    app.process();
    logger.info('end');
})();

