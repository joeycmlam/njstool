import { FileProcessorConfig } from "./etlProcesser";
import { iHolding } from "./iRecordType";

export const holdingConfig: FileProcessorConfig = {
    fileName: '',
    query: 'INSERT INTO holding (account_cd, stock_cd, exchange, unit, book_cost) VALUES ($1, $2, $3, $4, $5)',
    tableName: 'holding',
    columnNames: ['account_cd', 'stock_cd', 'exchange', 'unit', 'book_cost'],
    rowMapper: (row: iHolding) => {
        return {
            uploadDataRow: [row.account_cd, row.stock_cd, row.exchange, row.unit, row.book_cost]
        }},
    bulkMapper: (row: iHolding) => ({
        account_cd: row.account_cd,
        stock_cd: row.stock_cd,
        exchange: row.exchange,
        unit: row.unit,
        book_cost: row.book_cost
    }),
    truncateTable: true,
    isBulkUpload: true
};