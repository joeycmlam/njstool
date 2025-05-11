import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { MutualFundService } from "../../../MutualFundService";
import { Transaction, TransactionType } from "../../../PLCalculatorInterface";

let mutualFundService: MutualFundService;
let currentMarketPrice: number;
let profitLossResult: { realizedProfitLoss: number; unrealizedProfitLoss: number };

Given('I am using the {string} implementation', (implementation: string) => {
    if (implementation === "MutualFundService") {
        mutualFundService = new MutualFundService();
    } else {
        throw new Error(`Unknown implementation: ${implementation}`);
    }
});

Given('I have the following transactions:', (dataTable) => {
    const transactions: Transaction[] = dataTable.hashes().map(row => ({
        date: new Date(row.date),
        type: row.type as TransactionType,
        units: parseFloat(row.units),
        price: parseFloat(row.price),
    }));

    transactions.forEach(transaction => mutualFundService.addTransaction(transaction));
});

When('the current market price is {float}', (price: number) => {
    currentMarketPrice = price;
    profitLossResult = mutualFundService.calculateProfitLoss(currentMarketPrice);
});

Then('the profit and loss should be:', (dataTable) => {
    const expectedValues = dataTable.hashes();

    expectedValues.forEach(row => {
        const attribute = row.attribute;
        const expected = parseFloat(row.expected);

        // Dynamically compare the attribute in the profitLossResult
        expect(profitLossResult[attribute as keyof typeof profitLossResult]).to.equal(expected, `Mismatch for ${attribute}`);
    });
});
