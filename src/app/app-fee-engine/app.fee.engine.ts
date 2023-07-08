import LoggerFactory from '../lib/logger';
import FIFOHoldingPeriodCalculator, {enumTnxType, InvestmentTransaction} from "./FIFOHoldingPeriodCalculator";

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

        logger.info('Holding periods:', holdingPeriods);


        logger.info('process.end');
    }
}


const loggerFactory = LoggerFactory.getInstance('src/app/app-fee/config.yaml');
const logger = loggerFactory.getLogger();

(async () => {

    logger.info('start');

    app.process();
    logger.info('end');
})();

