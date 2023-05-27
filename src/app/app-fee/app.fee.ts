// Example usage:
import FeeCalculator, {Transaction} from "./feeCalculator";


class app {
    static async process() {
        const fileName: string = 'test/test-fee/test-data/A0001.xlsx'
        const feeCalculator = new FeeCalculator();
        const transactions = await feeCalculator.readTransactionsFromFile(fileName);
        console.log('Transactions:', transactions);

        const order1 : Partial<Transaction> = {};
        const order2 : Partial<Transaction>  = {};

        order1.tradeDate = '2017-11-01';
        order1.purchaseDate = '2017-09-01';
        order1.txnUnit = 10000;
        order2.tradeDate = '2017-11-01';
        order2.purchaseDate = '2017-10-01';
        order2.txnUnit = 5000;


        const fee1 = await feeCalculator.calculateFee(order1);
        const fee2 = await feeCalculator.calculateFee(order2);

        console.log(`Fee 1: ${fee1}`);
        console.log(`Fee 2: ${fee2}`);
    }
}

(async () => {
    console.log('start');
    app.process();
    console.log('end');
})();




