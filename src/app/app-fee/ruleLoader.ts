import fs from 'fs/promises';

export type FeeRate = {
    lowerBound: number;
    upperBound: number;
    rate: number;
};

export class RuleLoader {
    private static instance: RuleLoader;
    private feeRates: FeeRate[];
    private fileName: string;

    private constructor(file: string) {
        this.fileName = file;
        this.feeRates = [];
    }

    public static async getInstance(file = './fee-rules.json'): Promise<RuleLoader> {
        if (!RuleLoader.instance) {
            RuleLoader.instance = new RuleLoader(file);
            RuleLoader.instance.feeRates = await RuleLoader.instance.loadFeeRates();
        }
        return RuleLoader.instance;
    }

    private async loadFeeRates(): Promise<FeeRate[]> {
        const rawData = await fs.readFile(this.fileName, 'utf-8');
        const jsonData = JSON.parse(rawData);
        return jsonData.map((entry: any) => ({
            lowerBound: entry.lowerBound,
            upperBound: entry.upperBound === 'Infinity' ? Infinity : entry.upperBound,
            rate: entry.rate,
        }));
    }

    public getFeeRates(): FeeRate[] {
        return this.feeRates;
    }
}
