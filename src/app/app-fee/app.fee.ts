// Example usage:
import FeeCalculator from "./feeCalculator";


const fileName: string = 'test/test-fee/test-data/A0001.xlsx'
const feeCalculator = new FeeCalculator();
const transactions = feeCalculator.readTransactionsFromFile(fileName);
console.log('Transactions:', transactions);

const sellDate = '2017-11-01';
const units1 = 10000;
const units2 = 5000;

const fee1 = feeCalculator.calculateFee(sellDate, transactions[0].tradeDate, units1);
const fee2 = feeCalculator.calculateFee(sellDate, transactions[1].tradeDate, units2);

console.log(`Fee 1: ${fee1}`);
console.log(`Fee 2: ${fee2}`);
