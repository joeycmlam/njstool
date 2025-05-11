import { Holding, PositionCalculator, ProfitLoss, Transaction, TransactionType } from "./PLCalculatorInterface";

export class FIFOPositionCalculator implements PositionCalculator {
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

        // Pre-check: Ensure enough units are available for all SELL transactions
        const totalSellUnits = transactions
            .filter((transaction) => transaction.type === TransactionType.SELL)
            .reduce((sum, transaction) => sum + transaction.units, 0);

        const totalAvailableUnits = buyLots.reduce((sum, lot) => sum + lot.units, 0);

        if (totalSellUnits > totalAvailableUnits) {
            throw new Error("Selling more units than available in holdings.");
        }

        // Process SELL transactions
        for (const transaction of transactions) {
            if (transaction.type === TransactionType.SELL) {
                let remainingUnitsToSell = transaction.units;
                const sellPrice = transaction.price;

                while (remainingUnitsToSell > 0) {
                    const lot = buyLots[0];
                    const soldUnits = Math.min(lot.units, remainingUnitsToSell);

                    // Calculate realized P/L for the sold units
                    realizedProfitLoss += (sellPrice - lot.price) * soldUnits;

                    remainingUnitsToSell -= soldUnits;
                    lot.units -= soldUnits;

                    // Remove fully sold lot
                    if (lot.units === 0) {
                        buyLots.shift();
                    }
                }
            }
        }

        // Calculate unrealized P/L for remaining buyLots
        let unrealizedProfitLoss = 0;
        for (const lot of buyLots) {
            unrealizedProfitLoss += (currentMarketPrice - lot.price) * lot.units;
        }

        return {
            realizedProfitLoss,
            unrealizedProfitLoss,
        };
    }
}
