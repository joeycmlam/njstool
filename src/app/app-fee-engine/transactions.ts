import { injectable } from 'inversify';
import { createReadStream } from 'fs';
import csv from 'csv-parser';
import { InvestmentTransaction, enumTnxType } from './InvestmentTransaction';

@injectable()
class TransactionReader {
  private transactions: InvestmentTransaction[] = [];

  async readTransactions(filePath: string): Promise<InvestmentTransaction[]> {
    return new Promise((resolve, reject) => {
      createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          this.transactions.push({
            referenceId: data.ref_id,
            accountId: data.acct_id,
            orderDate: new Date(data.order_date.split('/').reverse().join('-')),
            orderType: data.type,
            orderAmount: parseFloat(data.order_amt),
            orderUnit: parseFloat(data.order_unit),
            nav: parseFloat(data.nav),
            txnUnit: parseFloat(data.txn_unit),
            txnAmount: parseFloat(data.txn_amount),
            fee: parseFloat(data.fee),
            txnDate: new Date(data.txn_date.split('/').reverse().join('-')),
          });
        })
        .on('end', () => {
          resolve(this.transactions);
        })
        .on('error', reject);
    });
  }
}