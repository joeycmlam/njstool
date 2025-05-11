import { calculateFIFOCapitalGains } from 'fifo-capital-gains-js';
import { Holding, PositionCalculator, ProfitLoss, Transaction, TransactionType } from "./PLCalculatorInterface";

export class CapitalGainsCalculator implements PositionCalculator {
    calculateBookCost(buyLots: { units: number; price: number }[]): Holding {
        const totalUnits = buyLots.reduce((sum, lot) => sum + lot.units, 0);
        const bookCost = buyLots.reduce((sum, lot) => sum + (lot.units * lot.price), 0);
        return { units: totalUnits, bookCost };
    }

    calculateProfitLoss(
        transactions: Transaction[],
        buyLots: { units: number; price: number }[],
        currentMarketPrice: number
    ): ProfitLoss {
        // Convert transactions to library's Operation format
        const operations = transactions.map(transaction => ({
            symbol: 'PORTFOLIO', // Single symbol assumption
            date: transaction.date,
            price: transaction.price,
            amount: transaction.units,
            type: transaction.type as 'BUY' | 'SELL'
        }));

        // Calculate realized PnL using FIFO capital gains
        let realizedProfitLoss = 0;
        try {
            const capitalGains = calculateFIFOCapitalGains(operations);
            realizedProfitLoss = capitalGains.reduce((sum, cg) => sum + cg.capitalGains, 0);
        } catch (error) {
            throw new Error(`Failed to calculate realized PnL: ${error.message}`);
        }

        // Calculate unrealized PnL from remaining buy lots
        const unrealizedProfitLoss = buyLots.reduce(
            (sum, lot) => sum + (currentMarketPrice - lot.price) * lot.units,
            0
        );

        return {
            realizedProfitLoss,
            unrealizedProfitLoss
        };
    }
}
