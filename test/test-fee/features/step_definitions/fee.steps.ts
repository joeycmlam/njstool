import {Before, Given, setWorldConstructor, Then, When} from "@cucumber/cucumber";
import FeeCalculator, {Transaction} from "../../../../src/app/app-fee/feeCalculator";
import {expect} from 'chai';
import {feeCustom} from "../../../support/world";
import * as path from "path";

let dataFile: any;
let order: Transaction;
let a: FeeCalculator;
let feeAmount: number;
Before(()=> {
    setWorldConstructor(feeCustom);
});



Given('the account current position file {string} and place {string} on {string} with {int} unit on {string}', (
    inDataFile: string, tradeType: string, fundId: string, sellUnit: number, orderDate: string) => {
    // a.dataFile = path.join('test/test-fee/test-data/', inDataFile);
    order.fundId = fundId;
    order.txnType = tradeType;
    order.txnUnit = sellUnit;
    order.tradeDate = orderDate;
    dataFile = path.join('test/test-fee/test-data/', inDataFile);
    // orderFundId = fundId;
    // orderTxnType = tradeType;
    // orderTxnUnit = sellUnit;
    // orderTradeDate = orderDate;
});

When('call the calculator',async () => {
    a = new FeeCalculator();
    // a.transactions = await a.feeCalculator.readTransactionsFromFile(dataFile);

    if (order.txnType === 'SELL') {
        feeAmount = a.calculateFee(order.tradeDate, order.tradeDate, order.txnUnit);
    } else {
        throw new Error(`Unsupported trade type: ${order.txnType}`);
    }
});

Then('total fee value is {int}', (expectedFeeAmount: number) => {
    expect(feeAmount).to.equal(expectedFeeAmount);
});
