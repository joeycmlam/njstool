import FIFOHoldingPeriodCalculator from './FIFOHoldingPeriodCalculator';
import { InvestmentTransaction, CalcuatedFeeTransaction } from './typeFeeEngine';
import { enumTnxType } from './enumFeeEngine';
import { v4 as uuidv4 } from 'uuid';

describe('FIFOHoldingPeriodCalculator', () => {
  let transactions: InvestmentTransaction[];
  let fifoHoldingPeriodCalculator: FIFOHoldingPeriodCalculator;

  beforeEach(() => {
    transactions = [
      {
        referenceId: uuidv4(),
        txnDate: new Date('2021-01-01'),
        transactionType: enumTnxType.SUBSCRIPTION,
        units: 100,
      },
      {
        referenceId: uuidv4(),
        txnDate: new Date('2021-02-01'),
        transactionType: enumTnxType.REDEMPTION,
        units: 50,
      },
      {
        referenceId: uuidv4(),
        txnDate: new Date('2021-03-01'),
        transactionType: enumTnxType.SUBSCRIPTION,
        units: 200,
      },
      {
        referenceId: uuidv4(),
        txnDate: new Date('2021-04-01'),
        transactionType: enumTnxType.REDEMPTION,
        units: 150,
      },
    ];
    fifoHoldingPeriodCalculator = new FIFOHoldingPeriodCalculator(transactions);
  });

it('should calculate holding periods', () => {
    const expectedHoldingPeriods: CalcuatedFeeTransaction[] = [
        { 
            holdingPeriod: 3, 
            deductedUnits: 50,
            txnDetail: {
                referenceId: uuidv4(),
                txnDate: new Date('2021-01-01'),
                transactionType: enumTnxType.REDEMPTION,
                units: 50,
            },
            soldUnits: 50,
        },
        { 
            holdingPeriod: 2, 
            deductedUnits: 50,
            txnDetail: {
                referenceId: uuidv4(),
                txnDate: new Date('2021-02-01'),
                transactionType: enumTnxType.REDEMPTION,
                units: 50,
            },
            soldUnits: 50,
        },
        { 
            holdingPeriod: 1, 
            deductedUnits: 100,
            txnDetail: {
                referenceId: uuidv4(),
                txnDate: new Date('2021-04-01'),
                transactionType: enumTnxType.REDEMPTION,
                units: 100,
            },
            soldUnits: 100,
        },
    ];
    const actualHoldingPeriods = fifoHoldingPeriodCalculator.calculateHoldingPeriods(
        new Date('2021-05-01'),
        150
    );
    expect(actualHoldingPeriods).toEqual(expectedHoldingPeriods);
});
});