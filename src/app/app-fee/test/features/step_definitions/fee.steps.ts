import {BeforeAll, Given, Then, When} from "@cucumber/cucumber";
import FeeCalculator, {enmTxnType} from "../../../feeCalculator";
import {expect} from 'chai';
import {feeCustom} from "../../../../../test/support/world";
import * as path from "path";
import TransactionLoader from "../../../transactionLoader";
import {FeeRate, RuleLoader} from "../../../ruleLoader";

let local: feeCustom;

async function getFeeRate() {
    const feeRuleFile: string = 'src/app/app-fee/year-fee-rules.json';
    const rulesLoader = await RuleLoader.getInstance(feeRuleFile);
    return rulesLoader.getFeeRates();
}

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
    local.order.txnType = stringToTxnType(tradeType) || undefined;
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
    local.order.txnType = stringToTxnType(tradeType) || undefined;
    local.order.unit = sellUnit;
    local.order.tradeDate = new Date(orderDate);
});

When('call the fee with holdings', async function () {
    const fileName: string = path.join(local.dataPath, local.dataFile);

    const txnLoader = new TransactionLoader(fileName);
    const transactions = await txnLoader.readTransactionsFromFile();

    const feeRates = await getFeeRate();
    local.feeCalculator = new FeeCalculator(feeRates);

    local.feeAmount = await local.feeCalculator.feeCal(local.order, transactions);
});

When('call the calculator', async () => {
    const feeRates  = await getFeeRate();
    local.feeCalculator = new FeeCalculator(feeRates);

    if (local.order.txnType === 'SELL') {
        local.feeAmount = await local.feeCalculator.calculateFee(local.order);
    } else {
        throw new Error(`Unsupported trade type: ${local.order.txnType}`);
    }
});

Then('total fee value is {int}', (expectedFeeAmount: number) => {
    expect(local.feeAmount).to.equal(expectedFeeAmount);
});
