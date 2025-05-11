import {Given, When, Then} from "@cucumber/cucumber";
import {expect} from "chai";
import {Holding, Transaction, TransactionType} from "../../../PLCalculatorInterface";
import {MutualFundService} from "../../../MutualFundService";

let mutualFundService: MutualFundService;
let currentMarketPrice: number;
let profitLossResult: { realizedProfitLoss: number; unrealizedProfitLoss: number };
let holding: Holding;
let position: number;
let bookCost: number;
let marketValue: number;

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

    // Destructure the returned object from calculateProfitLoss
    const result = mutualFundService.calculateProfitLoss(currentMarketPrice);
    holding = result.holding;
    profitLossResult = result.profitLoss;
    marketValue = holding.units * price;

});

Then('the profit and loss should be:', (dataTable) => {
    const expectedValues = dataTable.hashes();

    expectedValues.forEach(row => {
        const attribute = row.attribute;
        const expected = parseFloat(row.expected);

        let actual: number;

        // Dynamically determine the actual value based on the attribute
        if (attribute === "position") {
            actual = holding.units;
        } else if (attribute === "bookCost") {
            actual = holding.bookCost;
        } else if (attribute === "marketValue") {
            actual = marketValue;
        } else {
            actual = profitLossResult[attribute as keyof typeof profitLossResult];
        }

        // Log the comparison for better readability
        // console.log(`Comparing ${attribute}: expected = ${expected}, actual = ${actual}`);

        // Perform the comparison with a clear error message
        expect(actual, `Mismatch for ${attribute}: expected ${expected}, but got ${actual}`).to.equal(expected);
    });
});
