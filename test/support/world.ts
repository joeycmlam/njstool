import { setWorldConstructor } from '@cucumber/cucumber';
import FeeCalculator, {Transaction} from "../../src/app/app-fee/feeCalculator";

export  class CustomWorld {
    public dataPath: string;
    public jsonFile: string;
    public expectedFile: string;
    public actualFile: string;
}

export class feeCustom{
    public dataPath: string = '';
    public dataFile: string = '';
    public feeCalculator: FeeCalculator = new FeeCalculator();
    public transactions: Transaction[] = [];
    public order: Transaction = {
        txnId: 0,
        acctId: '',
        txnSeq: 0,
        txnType: '',
        tradeDate: '',
        fundId: '',
        valnDate: '',
        txnUnit: 0,
        processDate: '',
        unitCost: 0
    };
    public feeAmount: number = 0;
};

