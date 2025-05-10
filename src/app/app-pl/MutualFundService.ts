// MutualFundService.ts
export type TransactionType = "BUY" | "SELL";

export interface Transaction {
    date: Date;
    type: TransactionType;
    units: number;
    price: number;
}

export interface Holding {
    units: number;
    averageCost: number;
}

export interface ProfitLoss {
    realizedProfitLoss: number;
    unrealizedProfitLoss: number;
}

export class MutualFundService {
    private transactions: Transaction[] = [];
    private holding: Holding = { units: 0, averageCost: 0 };

    addTransaction(transaction: Transaction): void {
        this.transactions.push(transaction);
        this.updateHolding(transaction);
    }

    private updateHolding(transaction: Transaction): void {
        const { type, units, price } = transaction;

        if (type === "BUY") {
            const totalCost = this.holding.units * this.holding.averageCost + units * price;
            this.holding.units += units;
            this.holding.averageCost = totalCost / this.holding.units;
        } else if (type === "SELL") {
            if (units > this.holding.units) {
                throw new Error("Selling more units than available in holdings.");
            }
            this.holding.units -= units;
        }
    }

    calculateProfitLoss(currentMarketPrice: number): ProfitLoss {
        let realizedProfitLoss = 0;

        for (const transaction of this.transactions) {
            if (transaction.type === "SELL") {
                const sellUnits = transaction.units;
                const sellPrice = transaction.price;
                realizedProfitLoss += (sellPrice - this.holding.averageCost) * sellUnits;
            }
        }

        const unrealizedProfitLoss =
            (currentMarketPrice - this.holding.averageCost) * this.holding.units;

        return {
            realizedProfitLoss,
            unrealizedProfitLoss,
        };
    }
}
