export interface iAccount {
    account_cd: string;
    account_nm: string;
}

export interface iHolding {
    account_cd: string;
    stock_cd: string;
    exchange: string;
    unit: number;
    book_cost: number;
}
