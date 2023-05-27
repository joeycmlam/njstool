// Example usage:
import FeeCalculator from "./feeCalculator";


class app {
    static async process() {
        const fileName: string = 'test/test-fee/test-data/A0001.xlsx'
        const feeCalculator = new FeeCalculator();
        const transactions = await feeCalculator.readTransactionsFromFile(fileName);
        console.log('Transactions:', transactions);

        const sellDate: string = '2017-11-01';
        const units1: number = 10000;
        const units2: number = 5000;

        const fee1 = await feeCalculator.calculateFee(sellDate, transactions[0].tradeDate, units1);
        const fee2 = await feeCalculator.calculateFee(sellDate, transactions[1].tradeDate, units2);

        console.log(`Fee 1: ${fee1}`);
        console.log(`Fee 2: ${fee2}`);
    }
}

(async () => {
    console.log('start');
    app.process();
    console.log('end');
})();




