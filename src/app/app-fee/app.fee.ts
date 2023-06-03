import FeeCalculator, {enmTxnType, Transaction} from "./feeCalculator";
import {LoggerFactory} from "../lib/logger";


class app {

    static async process() {

        const order: Partial<Transaction> = {};
        order.acctId = 'A00001';
        order.fundId = 'F031';
        order.txnType = enmTxnType.Sell;
        order.tradeDate = new Date('2019-01-05') ;
        order.unit = 20000;


        const fileName: string = 'test/test-fee/test-data/A0001-01.xlsx'
        const cal = new FeeCalculator();
        const transactions = await cal.readTransactionsFromFile(fileName);


        const fee: number = await cal.feeCal(order, transactions);
        logger.info(`fee amount: [${fee}]`);
    }

    static async processSample() {
        const feeCalculator = new FeeCalculator();

        const order1 : Partial<Transaction> = {};
        const order2 : Partial<Transaction>  = {};

        order1.tradeDate = new Date('2022-10-05') ;
        order1.purchaseDate = new Date('2015-08-01') ;
        order1.unit = 10000;

        const fee1 = await feeCalculator.calculateFee(order1);

        logger.info(`Fee 1: ${fee1}`);
    }
}
const loggerFactory = LoggerFactory.getInstance('src/app/app-fee/config.yaml');
const logger = loggerFactory.getLogger();

(async () => {

    logger.info('start');
    await app.process();
    logger.info('end');
})();




