// Define a type for the DSC schedule

import {CalcuatedFeeTransaction} from "./typeFeeEngine";

export type DSCSchedule = Array<{ year: number; percentage: number }>;


export default class DSCCalculator {
    // The constructor can be used to set default DSC schedules if needed
    constructor(private dscSchedule: DSCSchedule) {}

    // Calculate the DSC based on the holding periods array
    calculateDSC(holdingPeriods: CalcuatedFeeTransaction[]): number {
        let totalDSCAmount = 0;

        for (const holdingPeriod of holdingPeriods) {
            // If the holding period is over 3 years, the fee is 0
            if (holdingPeriod.holdingPeriod > 3) {
                continue;
            }

            // Find the applicable DSC percentage based on the holding period
            const applicableDSCPercentage = this.getApplicableDSCPercentage(holdingPeriod.holdingPeriod);

            // Calculate the DSC amount for this holding period
            const dscAmount = (holdingPeriod.deductedUnits * applicableDSCPercentage) / 100;

            totalDSCAmount += dscAmount;
        }

        return totalDSCAmount;
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
