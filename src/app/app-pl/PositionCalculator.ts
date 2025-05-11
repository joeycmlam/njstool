import { Holding, ProfitLoss, Transaction, PositionCalculator } from "./PLCalculatorInterface";



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

        // Clone buyLots to avoid modifying the original array
        const remainingLots = [...buyLots];

        for (const transaction of transactions) {
            if (transaction.type === "SELL") {
                const sellUnits = transaction.units;
                const sellPrice = transaction.price;

                let remainingUnitsToSell = sellUnits;

                // Calculate realized P/L using FIFO lots
                for (let i = 0; i < remainingLots.length && remainingUnitsToSell > 0; i++) {
                    const lot = remainingLots[i];
                    const soldUnits = Math.min(lot.units, remainingUnitsToSell);

                    realizedProfitLoss += (sellPrice - lot.price) * soldUnits;
                    remainingUnitsToSell -= soldUnits;

                    // Update the lot to reflect the units sold
                    lot.units -= soldUnits;

                    // Remove the lot if all units are sold
                    if (lot.units === 0) {
                        remainingLots.splice(i, 1);
                        i--; // Adjust index after removal
                    }
                }
            }
        }

        // Calculate unrealized P/L for remaining holdings
        for (const lot of remainingLots) {
            unrealizedProfitLoss += (currentMarketPrice - lot.price) * lot.units;
        }

        return {
            realizedProfitLoss,
            unrealizedProfitLoss,
        };
    }
}
