import {Before, Given, setWorldConstructor, Then, When} from "@cucumber/cucumber";
import FeeCalculator from "../../../../src/app/app-fee/feeCalculator";
import {expect} from 'chai';
import {feeCustom} from "../../../support/world";
import * as path from "path";

let dataFile: any;
let orderFundId;
let orderTxnType;
let orderTxnUnit;
let orderTradeDate;
let a: FeeCalculator;
let feeAmount: number;
Before(()=> {
    setWorldConstructor(feeCustom);
});



Given('the account current position file {string} and place {string} on {string} with {int} unit on {string}', (
    inDataFile: string, tradeType: string, fundId: string, sellUnit: number, orderDate: string) => {
    // a.dataFile = path.join('test/test-fee/test-data/', inDataFile);
    // a.order.fundId = fundId;
    // a.order.txnType = tradeType;
    // a.order.txnUnit = sellUnit;
    // a.order.tradeDate = orderDate;
    dataFile = path.join('test/test-fee/test-data/', inDataFile);
    orderFundId = fundId;
    orderTxnType = tradeType;
    orderTxnUnit = sellUnit;
    orderTradeDate = orderDate;
});

When('call the calculator',async () => {
    a = new FeeCalculator();
    // a.transactions = await a.feeCalculator.readTransactionsFromFile(dataFile);

    if (orderTxnType === 'SELL') {
        feeAmount = a.calculateFee(orderTradeDate, orderTradeDate, orderTxnUnit);
    } else {
        throw new Error(`Unsupported trade type: ${orderTxnType}`);
    }
});

Then('total fee value is {int}', (expectedFeeAmount: number) => {
    expect(feeAmount).to.equal(expectedFeeAmount);
});
