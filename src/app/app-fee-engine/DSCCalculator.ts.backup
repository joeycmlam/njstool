import { CalcuatedFeeTransaction } from "./typeFeeEngine";

export type DSCSchedule = Array<{ year: number; percentage: number }>;

export type DSCFeeTransaction = {
    holdingPeriodTransaction: CalcuatedFeeTransaction;
    applicableDSCPercentage: number;
    dscAmount: number;
};

export type DSCResult = {
    totalDSCAmount: number;
    dscFeeTransactions: DSCFeeTransaction[];
};

export default class DSCCalculator {
    // The constructor can be used to set default DSC schedules if needed
    constructor(private dscSchedule: DSCSchedule) {}

    // Calculate the DSC based on the holding periods array
    public calculateDSC(holdingPeriods: CalcuatedFeeTransaction[]): DSCResult {
        const dscFeeTransactions: DSCFeeTransaction[] = [];
        let totalDSCAmount = 0;

        for (const holdingPeriod of holdingPeriods) {
            // If the holding period is over 3 years, the fee is 0
            if (holdingPeriod.holdingPeriod > 3) {
                continue;
            }

            // Find the applicable DSC percentage based on the holding period
            const applicableDSCPercentage = this.getApplicableDSCPercentage(holdingPeriod.holdingPeriod);

            // Calculate the DSC amount for this holding period
            const dscAmount = holdingPeriod.deductedUnits * applicableDSCPercentage;

            // Add the DSC fee transaction to the output array
            dscFeeTransactions.push({
                holdingPeriodTransaction: holdingPeriod,
                applicableDSCPercentage,
                dscAmount,
            });

            totalDSCAmount += dscAmount;
        }

        return {
            totalDSCAmount,
            dscFeeTransactions,
        };
    }

    // Get the applicable DSC percentage based on the holding period
    private getApplicableDSCPercentage(holdingPeriod: number): number {
        let applicablePercentage = 0;

        for (const entry of this.dscSchedule) {
            if (holdingPeriod >= entry.year) {
                applicablePercentage = entry.percentage;
            } else {
                break;
            }
        }

        return applicablePercentage;
    }
}
