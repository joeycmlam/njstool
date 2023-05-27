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

Given('the account current position file {string} and place {string} on {string} with {int} unit on {string} with {string}', (
    inDataFile: string, tradeType: string, fundId: string, sellUnit: number, orderDate: string, purchaseDate: string) => {
    local = new feeCustom();
    local.order.fundId = fundId;
    local.order.txnType = stringToTxnType(tradeType);
    local.order.unit = sellUnit;
    local.order.tradeDate = orderDate;
    local.order.purchaseDate = purchaseDate;
    local.dataFile = path.join('test/test-fee/test-data/', inDataFile);
});

When('call the calculator', async () => {
    local.feeCalculator = new FeeCalculator();
    // a.transactions = await a.feeCalculator.readTransactionsFromFile(dataFile);

    if (local.order.txnType === 'SELL') {
        local.feeAmount = local.feeCalculator.calculateFee(local.order);
    } else {
        throw new Error(`Unsupported trade type: ${local.order.txnType}`);
    }
});

Then('total fee value is {int}', (expectedFeeAmount: number) => {
    expect(local.feeAmount).to.equal(expectedFeeAmount);
});
