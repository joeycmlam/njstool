import {Before, Given, setWorldConstructor, Then, When} from "@cucumber/cucumber";
import FeeCalculator, {Transaction} from "../../../../src/app/app-fee/feeCalculator";
import {expect} from 'chai';
import {feeCustom} from "../../../support/world";
import * as path from "path";

let local: feeCustom;

Before(()=> {
    setWorldConstructor(feeCustom);
});


Given('the account current position file {string} and place {string} on {string} with {int} unit on {string}', (
    inDataFile: string, tradeType: string, fundId: string, sellUnit: number, orderDate: string) => {
    // a.dataFile = path.join('test/test-fee/test-data/', inDataFile);
    local = new feeCustom();
    local.order.fundId = fundId;
    local.order.txnType = tradeType;
    local.order.txnUnit = sellUnit;
    local.order.tradeDate = orderDate;
    local.dataFile = path.join('test/test-fee/test-data/', inDataFile);
});

When('call the calculator',async () => {
    local.feeCalculator = new FeeCalculator();
    // a.transactions = await a.feeCalculator.readTransactionsFromFile(dataFile);

    if (local.order.txnType === 'SELL') {
        local.feeAmount = local.feeCalculator.calculateFee(local.order.tradeDate, local.order.tradeDate, local.order.txnUnit);
    } else {
        throw new Error(`Unsupported trade type: ${local.order.txnType}`);
    }
});

Then('total fee value is {int}', (expectedFeeAmount: number) => {
    expect(local.feeAmount).to.equal(expectedFeeAmount);
});
