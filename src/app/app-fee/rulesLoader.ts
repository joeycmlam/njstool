import fs from 'fs';

export type FeeRate = {
    lowerBound: number;
    upperBound: number;
    rate: number;
};

export class rulesLoader {
    private static instance: rulesLoader;
    private feeRates: FeeRate[];

    private constructor(filePath: string) {
        this.feeRates = this.loadFeeRates(filePath);
    }

    public static getInstance(filePath = './fee-rules.json'): rulesLoader {
        if (!rulesLoader.instance) {
            rulesLoader.instance = new rulesLoader(filePath);
        }
        return rulesLoader.instance;
    }

    private loadFeeRates(filePath: string): FeeRate[] {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(rawData);
        return jsonData.map((entry: any) => ({
            lowerBound: entry.lowerBound,
            upperBound: entry.upperBound === 'Infinity' ? Infinity : entry.upperBound,
            rate: entry.rate
        }));
    }

    public getFeeRates(): FeeRate[] {
        return this.feeRates;
    }
}
