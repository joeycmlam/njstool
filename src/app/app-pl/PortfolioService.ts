import { Holding, PLCalculatorInterface, ProfitLoss, Transaction, TransactionType } from "./PLCalculatorInterface";

export class PortfolioService implements PLCalculatorInterface {
    private transactions: Transaction[] = [];
    private holding: Holding = { units: 0, bookCost: 0 };
    private buyLots: { units: number; price: number }[] = [];

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
        const totalUnits = this.getTotalUnits();
        if (totalUnits === 0) {
            this.holding = { units: 0, bookCost: 0 }; // Reset bookCost to 0
        } else {
            const totalCost = this.buyLots.reduce((sum, lot) => sum + lot.units * lot.price, 0);
            this.holding = { units: totalUnits, bookCost: totalCost }; // Update bookCost
        }
    }

    calculateProfitLoss(currentMarketPrice: number): { holding: Holding; profitLoss: ProfitLoss } {
        let realizedProfitLoss = 0;
        let unrealizedProfitLoss = 0;

        for (const transaction of this.transactions) {
            if (transaction.type === TransactionType.SELL) {
                const sellUnits = transaction.units;
                const sellPrice = transaction.price;

                let remainingUnitsToSell = sellUnits;

                // Calculate realized P/L using FIFO lots
                for (const lot of this.buyLots) {
                    if (remainingUnitsToSell === 0) break;

                    const soldUnits = Math.min(lot.units, remainingUnitsToSell);
                    realizedProfitLoss += (sellPrice - lot.price) * soldUnits;
                    remainingUnitsToSell -= soldUnits;
                }
            }
        }

        // Calculate unrealized P/L for remaining holdings
        for (const lot of this.buyLots) {
            unrealizedProfitLoss += (currentMarketPrice - lot.price) * lot.units;
        }

        const profitLoss: ProfitLoss = {
            realizedProfitLoss,
            unrealizedProfitLoss,
        };

        return {
            holding: this.holding,
            profitLoss,
        };
    }
}
