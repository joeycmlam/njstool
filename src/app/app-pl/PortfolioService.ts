import { Holding, PLCalculatorInterface, ProfitLoss, Transaction, TransactionType } from "./PLCalculatorInterface";
import { PositionCalculator } from "./PositionCalculator";

export class PortfolioService implements PLCalculatorInterface {
    private transactions: Transaction[] = [];
    private holding: Holding = { units: 0, bookCost: 0 };
    private buyLots: { units: number; price: number }[] = [];

    constructor(private positionCalculator: PositionCalculator) {}

    addTransaction(transaction: Transaction): void {
        this.transactions.push(transaction);
        this.updateHolding(transaction);
    }

    private updateHolding(transaction: Transaction): void {
        const { type, units, price } = transaction;

        if (units <= 0 || price <= 0) {
            throw new Error("Transaction units and price must be positive.");
        }

        if (type === TransactionType.BUY) {
            this.buyLots.push({ units, price });
        } else if (type === TransactionType.SELL) {
            if (units > this.getTotalUnits()) {
                throw new Error("Selling more units than available in holdings.");
            }

            let remainingUnitsToSell = units;

            while (remainingUnitsToSell > 0) {
                const lot = this.buyLots[0]; // FIFO: Take from the oldest lot
                const unitsToSell = Math.min(lot.units, remainingUnitsToSell);

                remainingUnitsToSell -= unitsToSell;
                lot.units -= unitsToSell;

                if (lot.units === 0) {
                    this.buyLots.shift(); // Remove the lot if fully sold
                }
            }
        }

        this.updateHoldingSummary();
    }

    private getTotalUnits(): number {
        return this.buyLots.reduce((sum, lot) => sum + lot.units, 0);
    }

    private updateHoldingSummary(): void {
        this.holding = this.positionCalculator.calculateBookCost(this.buyLots);
    }

    calculateProfitLoss(currentMarketPrice: number): { holding: Holding; profitLoss: ProfitLoss } {
        const profitLoss = this.positionCalculator.calculateProfitLoss(
            this.transactions,
            this.buyLots,
            currentMarketPrice
        );

        return {
            holding: this.holding,
            profitLoss,
        };
    }
}
