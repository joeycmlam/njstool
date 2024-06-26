import Logger from "../lib/logger";
import FeeCalculator, {enmTxnType, Transaction} from "./feeCalculator";
import {FeeRate, RuleLoader} from "./ruleLoader";
import TransactionLoader from "./transactionLoader";


class app {

    static async processByaum() {
        // Load fee rates
        const feeRuleFile: string = 'src/app/app-fee/aum-fee-rules.json';
        const rulesLoader = await RuleLoader.getInstance(feeRuleFile);
        const feeRates: FeeRate[] = rulesLoader.getFeeRates();

        // Create fee calculator
        const feeCalculator = new FeeCalculator(feeRates);

        // Usage example
        const dailyAUM: number = 2_500_000;
        const fee = feeCalculator.calcFeeByAUM(dailyAUM);
        console.log(`The fee for a daily AUM of ${dailyAUM} is ${fee}`);
    }


    static async processByyear() {

        const order: Partial<Transaction> = {};
        order.acctId = 'A00001';
        order.fundId = 'F031';
        order.txnType = enmTxnType.Sell;
        order.tradeDate = new Date('2019-01-05') ;
        order.unit = 20000;


        const fileName: string = 'test/test-fee/test-data/A0001-01.xlsx'

        // Load fee rates
        const feeRuleFile: string = 'src/app/app-fee/year-fee-rules.json';
        const rulesLoader = await RuleLoader.getInstance(feeRuleFile);
        const feeRates: FeeRate[] = rulesLoader.getFeeRates();

        const txnLoader = new TransactionLoader(fileName);
        const transactions = await txnLoader.readTransactionsFromFile();


        const cal = new FeeCalculator(feeRates);



        const fee: number = await cal.feeCal(order, transactions);
        logger.info(`fee amount: [${fee}]`);
    }

    static async processSample() {
        // Load fee rates
        const feeRuleFile: string = 'src/app/app-fee/year-fee-rules.json';
        const rulesLoader = await RuleLoader.getInstance(feeRuleFile);
        const feeRates: FeeRate[] = rulesLoader.getFeeRates();

        const feeCalculator = new FeeCalculator(feeRates);

        const order1 : Partial<Transaction> = {};
        const order2 : Partial<Transaction>  = {};

        order1.tradeDate = new Date('2017-12-01') ;
        order1.purchaseDate = new Date('2017-10-01') ;
        order1.unit = 10000;

        const fee1 = await feeCalculator.calculateFee(order1);

        logger.info(`Fee 1: ${fee1}`);
    }
}

const logger = Logger.getLogger();

async function main() {
    logger.info('start');
    // await app.processByaum();
    await app.processSample();
    logger.info('end');
}

main();