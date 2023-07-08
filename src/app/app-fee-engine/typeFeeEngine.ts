// Define a type for Investment Transaction
import {enumTnxType} from "./enumFeeEngine";

export type InvestmentTransaction = {
    referenceId: string;
    txnDate: Date;
    units: number;
    transactionType: enumTnxType;
};

// Define a type for Holding Period
export type CalcuatedFeeTransaction = {
    txnDetail: InvestmentTransaction;
    holdingPeriod: number;
    soldUnits: number;
    deductedUnits: number;
};
