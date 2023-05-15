export interface iUploader {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    truncateTable(tableName: string): Promise<void>;
    uploadData(data: any[], query: string, rowMapper: (row: any) => any[]): Promise<void>;
    bulkUpload(data: any[], tableName: string, columnName: string[], rowMapper: (row: any) => any[]): Promise<void>;
}

export interface iDataReader {
    extractData(): Promise<any[]>;
}
