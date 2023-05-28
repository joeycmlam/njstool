import {Given, Then, When} from "@cucumber/cucumber";
import FeeCalculator, {enmTxnType} from "../../../../src/app/app-fee/feeCalculator";
import {expect} from 'chai';
import {feeCustom} from "../../../support/world";
import * as path from "path";

let local: feeCustom;


function stringToTxnType(value: string): enmTxnType | null {
    if ('BUY' === value.toUpperCase()) {
        return enmTxnType.Buy;
    }

    if ('SELL' === value.toUpperCase()) {
        return enmTxnType.Sell;
    }

    return null;
}

Given('place {string} on {string} with {int} unit on {string} with {string}', (
    tradeType: string, fundId: string, sellUnit: number, purchaseDate: string, orderDate: string) => {
    local = new feeCustom();
    local.order.fundId = fundId;
    local.order.txnType = stringToTxnType(tradeType);
    local.order.unit = sellUnit;
    local.order.tradeDate = new Date(orderDate);
    local.order.purchaseDate = new Date(purchaseDate);
});

Given('the account {string} position file {string} and place {string} on {string} with {int} unit on {string}', (
    acctId: string, inDataFile: string, tradeType: string, fundId: string, sellUnit: number, orderDate: string) => {
    local = new feeCustom();
    local.dataFile = inDataFile;
    local.order.acctId = acctId;
    local.order.fundId = fundId;
    local.order.txnType = stringToTxnType(tradeType);
    local.order.unit = sellUnit;
    local.order.tradeDate = new Date(orderDate);
});

When('call the fee with holdings', async function () {
    const fileName: string = path.join(local.dataPath, local.dataFile);
    const cal = new FeeCalculator();
    const transactions = await cal.readTransactionsFromFile(fileName);

    local.feeAmount = await local.feeCalculator.feeCal(local.order, transactions);
});

When('call the calculator', async () => {
    local.feeCalculator = new FeeCalculator();
    // a.transactions = await a.feeCalculator.readTransactionsFromFile(dataFile);

    if (local.order.txnType === 'SELL') {
        local.feeAmount = await local.feeCalculator.calculateFee(local.order);
    } else {
        throw new Error(`Unsupported trade type: ${local.order.txnType}`);
    }
});

Then('total fee value is {int}', (expectedFeeAmount: number) => {
    expect(local.feeAmount).to.equal(expectedFeeAmount);
});

