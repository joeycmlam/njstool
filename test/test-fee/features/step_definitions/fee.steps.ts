import {BeforeAll, Given, setWorldConstructor, Then, When} from "@cucumber/cucumber";
import FeeCalculator, {Transaction} from "../../../../src/app/app-fee/feeCalculator";
import {expect} from 'chai';
import * as path from "path";
import CustomWorld from "../../../support/world";

class feeCustom{
    dataFile: string;
    feeCalculator: FeeCalculator;
    transactions: Transaction[];
    order: Transaction;
    feeAmount: number;
};


BeforeAll(async () => {
    setWorldConstructor(feeCustom);
});

Given('the account current position file {string} and place {string} on {string} with {int} unit on {string}', (
    a: feeCustom,
    inDataFile: string, tradeType: string, fundId: string, sellUnit: number, orderDate: string) => {
    a.feeCalculator = new FeeCalculator();
    a.transactions = a.feeCalculator.readTransactionsFromFile(inDataFile);
    a.order.fundId = fundId;
    a.order.txnType = tradeType;
    a.order.txnUnit = sellUnit;
    a.order.tradeDate = orderDate;
});

When('call the calculator', (a: feeCustom) => {
    a.transactions = a.feeCalculator.readTransactionsFromFile(a.dataFile);

    if (a.order.txnType === 'SELL') {
        a.feeAmount = a.feeCalculator.calculateFee(a.order.tradeDate, a.transactions[0].tradeDate, a.order.txnUnit);
    } else {
        throw new Error(`Unsupported trade type: ${a.order.txnType}`);
    }
});

Then('total fee value is {int}', (a: feeCustom, expectedFeeAmount: number) => {
    expect(a.feeAmount).to.equal(expectedFeeAmount);
});
