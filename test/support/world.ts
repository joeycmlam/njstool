import { setWorldConstructor } from '@cucumber/cucumber';
import FeeCalculator, {Transaction} from "../../src/app/app-fee/feeCalculator";

export  class CustomWorld {
    public dataPath: string;
    public jsonFile: string;
    public expectedFile: string;
    public actualFile: string;
}

export class feeCustom{
    public dataPath: string = 'test/test-fee/test-data/';
    public dataFile: string = '';
    public feeCalculator: FeeCalculator = new FeeCalculator();
    public transactions: Transaction[] = [];
    public order: Partial< Transaction> = {};
    public feeAmount: number = 0;
};

