import { injectable } from 'inversify';
import ExcelReader from '../lib/excelReader';
import { OrderTxnType } from './orderTxnType';
import { OrderType } from './orderType';

@injectable()
class TransactionReader {
    private transactions: OrderTxnType[] = [];
    private excelReader: ExcelReader;

    constructor(filePath: string) {
        this.excelReader = new ExcelReader(filePath);
    }

    async readTransactions(): Promise<OrderTxnType[]> {
        const data = await this.excelReader.extractData();
        this.transactions = data.map(row => {
            const orderDetail = new OrderType(
                row.ref_id,
                row.acct_id,
                new Date(row.order_date.split('/').reverse().join('-')),
                row.type,
                parseFloat(row.order_unit),
                row.status
            );

            return new OrderTxnType(
                orderDetail,
                new Date(row.dealing_date.split('/').reverse().join('-')),
                new Date(row.settlement_date.split('/').reverse().join('-')),
                parseFloat(row.units),
                parseFloat(row.amount)
            );
        });
        return this.transactions;
    }
}
