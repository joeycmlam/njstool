import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { PLCalculatorInterface, Transaction, ProfitLoss, TransactionType } from "../../../PLCalculatorInterface";
import {MutualFundService} from "../../../MutualFundService";

let mutualFundService: PLCalculatorInterface;
let profitLoss: ProfitLoss;

Given("I am using the {string} implementation", async function (implementationName: string) {
    if (implementationName === "MutualFundService") {
        mutualFundService = new MutualFundService();
    } else {
        throw new Error(`Implementation "${implementationName}" not found.`);
    }
});

Given("I have the following transactions:", function (dataTable) {
    const transactions: Transaction[] = dataTable.hashes().map((row: any) => ({
        date: new Date(row.date),
        type: row.type as TransactionType,
        units: parseFloat(row.units),
        price: parseFloat(row.price),
    }));

    transactions.forEach((transaction) => mutualFundService.addTransaction(transaction));
});

When("the current market price is {float}", function (currentMarketPrice: number) {
    profitLoss = mutualFundService.calculateProfitLoss(currentMarketPrice);
});

Then("the realized profit loss should be {float}", function (expectedRealizedPL: number) {
    expect(profitLoss.realizedProfitLoss).to.be.closeTo(expectedRealizedPL, 0.01);
});

Then("the unrealized profit loss should be {float}", function (expectedUnrealizedPL: number) {
    expect(profitLoss.unrealizedProfitLoss).to.be.closeTo(expectedUnrealizedPL, 0.01);
});
