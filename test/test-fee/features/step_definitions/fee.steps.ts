import { Given,  Then, When} from "@cucumber/cucumber";
import FeeCalculator from "../../../../src/app/app-fee/feeCalculator";
import {expect} from 'chai';
import {feeCustom} from "../../../support/world";
import * as path from "path";


Given('the account current position file {string} and place {string} on {string} with {int} unit on {string}', (
    a: feeCustom,
    inDataFile: string, tradeType: string, fundId: string, sellUnit: number, orderDate: string) => {
    a.dataFile = path.join(a.dataPath, inDataFile);
    a.order.fundId = fundId;
    a.order.txnType = tradeType;
    a.order.txnUnit = sellUnit;
    a.order.tradeDate = orderDate;
});

When('call the calculator', (a: feeCustom) => {
    a.feeCalculator = new FeeCalculator();
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
