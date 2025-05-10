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

export interface PLCalculatorInterface {
    addTransaction(trana): void;
    calculateProfitLoss(currentMarketPrice : number): ProfitLoss;
}
