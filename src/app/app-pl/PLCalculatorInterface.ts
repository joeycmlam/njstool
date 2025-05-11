export enum TransactionType {
    BUY = "BUY",
    SELL = "SELL",
}

export interface Transaction {
    date: Date;
    type: TransactionType;
    units: number;
    price: number;
}

export interface Holding {
    units: number;
    bookCost: number;
}

export interface ProfitLoss {
    realizedProfitLoss: number;
    unrealizedProfitLoss: number;
}

export interface PLCalculatorInterface {
    addTransaction(trxn: Transaction): void;
    calculateProfitLoss(currentMarketPrice: number): { holding: Holding; profitLoss: ProfitLoss };
}
