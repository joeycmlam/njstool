import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { readFileSync } from "fs";
import * as path from "path";
import * as XLSX from "xlsx";
import { Holding, Transaction, TransactionType } from "../../../PLCalculatorInterface";
import { PortfolioService } from "../../../PortfolioService";
import { DefaultPositionCalculator } from "../../../PositionCalculator";

let portfolioService: PortfolioService;
let currentMarketPrice: number;
let profitLossResult: { realizedProfitLoss: number; unrealizedProfitLoss: number };
let holding: Holding;
let marketValue: number;

/**
 * Helper function to parse data from an Excel sheet into Transaction objects.
 * @param transactionsData - Raw data parsed from the Excel sheet.
 * @returns Array of Transaction objects.
 */
function parseData(transactionsData: any[]): Transaction[] {
    return transactionsData.map(row => {
        // Convert Excel serial date to JavaScript Date
        let date: Date;
        if (typeof row.date === "number") {
            const parsedDate = XLSX.SSF.parse_date_code(row.date);
            if (parsedDate) {
                date = new Date(parsedDate.y, parsedDate.m - 1, parsedDate.d);
            } else {
                throw new Error(`Invalid date in row: ${JSON.stringify(row)}`);
            }
        } else {
            date = new Date(row.date);
        }

        if (isNaN(date.getTime())) {
            throw new Error(`Invalid date in row: ${JSON.stringify(row)}`);
        }

        // Validate and parse other fields
        const type = row.type as TransactionType;
        const units = parseFloat(row.units);
        const price = parseFloat(row.price || row.pirce); // Handle misspelled column name

        if (!type || isNaN(units) || isNaN(price)) {
            throw new Error(`Invalid row in Excel file: ${JSON.stringify(row)}`);
        }

        return { date, type, units, price };
    });
}

Given('I am using the {string} implementation', (implementation: string) => {
    if (implementation === "MutualFundService") {
        const positionCalculator = new DefaultPositionCalculator();
        portfolioService = new PortfolioService(positionCalculator);
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

    transactions.forEach(transaction => portfolioService.addTransaction(transaction));
});

Given('I have the transactions from the Excel file {string} and worksheet {string}', (filePath: string, sheetName: string) => {
    // Resolve the full path to the Excel file
    const fullPath = path.resolve(__dirname, "../../../Test", filePath);

    console.log(`Reading Excel file from: ${fullPath}`);
    console.log(`Using worksheet: ${sheetName}`);

    // Read the Excel file
    const fileBuffer = readFileSync(fullPath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    // Get the specified worksheet
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        throw new Error(`Worksheet "${sheetName}" not found in file "${filePath}"`);
    }

    // Parse the sheet into JSON
    const transactionsData: any[] = XLSX.utils.sheet_to_json(sheet);

    console.log(`Parsed transactions from Excel (raw):`, transactionsData);

    // Use the parseData function to convert raw data into Transaction objects
    const transactions = parseData(transactionsData);

    console.log(`Converted transactions:`, transactions);

    // Add each transaction to the portfolio service
    transactions.forEach(transaction => portfolioService.addTransaction(transaction));

    console.log(`All transactions have been added successfully.`);
});

When('the current market price is {float}', (price: number) => {
    currentMarketPrice = price;

    // Destructure the returned object from calculateProfitLoss
    const result = portfolioService.calculateProfitLoss(currentMarketPrice);
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
        console.log(`Comparing ${attribute}: expected = ${expected}, actual = ${actual}`);

        // Perform the comparison with a clear error message
        expect(actual, `Mismatch for ${attribute}: expected ${expected}, but got ${actual}`).to.equal(expected);
    });
});
