// Define a type for the DSC schedule
type DSCSchedule = Array<{ year: number; percentage: number }>;

class DSCCalculator {
    // The constructor can be used to set default DSC schedules if needed
    constructor(private dscSchedule: DSCSchedule) {}

    // Calculate the DSC based on the investment amount and holding period
    calculateDSC(investmentAmount: number, holdingPeriod: number): number {
        // Find the applicable DSC percentage based on the holding period
        const applicableDSCPercentage = this.getApplicableDSCPercentage(holdingPeriod);

        // Calculate the DSC amount
        const dscAmount = (investmentAmount * applicableDSCPercentage) / 100;

        return dscAmount;
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

// Example usage:
const dscSchedule: DSCSchedule = [
    { year: 1, percentage: 6 },
    { year: 2, percentage: 5 },
    { year: 3, percentage: 4 },
    { year: 4, percentage: 3 },
    { year: 5, percentage: 2 },
    { year: 6, percentage: 1 },
];

const dscCalculator = new DSCCalculator(dscSchedule);
const investmentAmount = 10000; // $10,000
const holdingPeriod = 3; // 3 years

const dscAmount = dscCalculator.calculateDSC(investmentAmount, holdingPeriod);
console.log(`The Deferred Sales Charge is: $${dscAmount}`);
