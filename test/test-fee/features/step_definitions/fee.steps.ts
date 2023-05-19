import {Given, Then, When} from "@cucumber/cucumber";
import FeeCalculator, { Transaction } from "../../../../src/app/app-fee/feeCalculator";
import { expect } from 'chai';

let feeCalculator: FeeCalculator;
let transactions: Transaction[];
let sellUnits: number;
let tradeType: string;
let tradeDate: string;
let feeAmount: number;

Given('the account current position file "{string}" and place "{string}" {int} at "{string}"', (inDataFile: string, currentTradeType: string, sellUnit: number, currentTradeDate: string) => {
    feeCalculator = new FeeCalculator();
    transactions = feeCalculator.readTransactionsFromFile(inDataFile);
    sellUnits = sellUnit;
    tradeType = currentTradeType;
    tradeDate = currentTradeDate;
});

When('call the calculator', () => {
    if (tradeType === 'SELL') {
        feeAmount = feeCalculator.calculateFee(tradeDate, transactions[0].tradeDate, sellUnits);
    } else {
        throw new Error(`Unsupported trade type: ${tradeType}`);
    }
});

Then('total fee value is {int}', (expectedFeeAmount: number) => {
    expect(feeAmount).to.equal(expectedFeeAmount);
});
