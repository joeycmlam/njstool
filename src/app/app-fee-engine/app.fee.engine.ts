import LoggerFactory from '../lib/logger';
import FIFOHoldingPeriodCalculator, {enumTnxType, InvestmentTransaction} from "./FIFOHoldingPeriodCalculator";

class app {


    static async  process() {
        logger.info('process.start');
// Example usage:
        const transactions: InvestmentTransaction[] = [
            { txnDate: new Date('2020-01-01'), units: 100, transactionType: enumTnxType.SUBSCRIPTION },
            { txnDate: new Date('2020-06-01'), units: 50, transactionType: enumTnxType.SUBSCRIPTION},
            { txnDate: new Date('2021-01-01'), units: 50, transactionType: enumTnxType.SUBSCRIPTION },
        ];

        const referenceDate = new Date('2023-07-08'); // The date to calculate holding periods
        const fifoHoldingPeriodCalculator = new FIFOHoldingPeriodCalculator(transactions);
        const holdingPeriods = fifoHoldingPeriodCalculator.calculateHoldingPeriods(referenceDate, 10);

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

