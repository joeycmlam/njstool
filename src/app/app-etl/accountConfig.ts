import { FileProcessorConfig } from "./etlProcesser";
import { iAccount } from "./iRecordType";

export const accountConfig: FileProcessorConfig = {
    fileName: '',
    query: 'INSERT INTO account (account_cd, account_nm) VALUES ($1, $2)',
    tableName: 'account',
    columnNames: ['account_cd', 'account_nm'],
    rowMapper: (row: iAccount) => {
        return {
            uploadDataRow: [row.account_cd, row.account_nm],
        }},
    bulkMapper: (row: iAccount) => ({
        account_cd: row.account_cd,
        account_nm: row.account_nm
    }),
    truncateTable: true,
    isBulkUpload: false, 
};