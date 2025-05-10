import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { MutualFundService } from "../../../MutualFundService";
import { Transaction, ProfitLoss } from "../../../PLCalculatorInterface";

let mutualFundService: MutualFundService;
let profitLoss: ProfitLoss;

Given("I have the following transactions:", function (dataTable) {
    mutualFundService = new MutualFundService();

    // Parse the data table into transactions and add them to the service
    const transactions: Transaction[] = dataTable.hashes().map((row: any) => ({
        date: new Date(row.date),
        type: row.type as "BUY" | "SELL",
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
