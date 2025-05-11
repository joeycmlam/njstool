import { Holding, ProfitLoss, Transaction } from "./PLCalculatorInterface";

export interface PositionCalculator {
    calculateBookCost(buyLots: { units: number; price: number }[]): Holding;
    calculateProfitLoss(
        transactions: Transaction[],
        buyLots: { units: number; price: number }[],
        currentMarketPrice: number
    ): ProfitLoss;
}

export class DefaultPositionCalculator implements PositionCalculator {
    calculateBookCost(buyLots: { units: number; price: number }[]): Holding {
        const totalUnits = buyLots.reduce((sum, lot) => sum + lot.units, 0);
        if (totalUnits === 0) {
            return { units: 0, bookCost: 0 };
        }

        const totalCost = buyLots.reduce((sum, lot) => sum + lot.units * lot.price, 0);
        return { units: totalUnits, bookCost: totalCost };
    }

    calculateProfitLoss(
        transactions: Transaction[],
        buyLots: { units: number; price: number }[],
        currentMarketPrice: number
    ): ProfitLoss {
        let realizedProfitLoss = 0;
        let unrealizedProfitLoss = 0;

        for (const transaction of transactions) {
            if (transaction.type === "SELL") {
                const sellUnits = transaction.units;
                const sellPrice = transaction.price;

                let remainingUnitsToSell = sellUnits;

                // Calculate realized P/L using FIFO lots
                for (const lot of buyLots) {
                    if (remainingUnitsToSell === 0) break;

                    const soldUnits = Math.min(lot.units, remainingUnitsToSell);
                    realizedProfitLoss += (sellPrice - lot.price) * soldUnits;
                    remainingUnitsToSell -= soldUnits;
                }
            }
        }

        // Calculate unrealized P/L for remaining holdings
        for (const lot of buyLots) {
            unrealizedProfitLoss += (currentMarketPrice - lot.price) * lot.units;
        }

        return {
            realizedProfitLoss,
            unrealizedProfitLoss,
        };
    }
}
