export interface iUploader {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    truncateTable(tableName: string): Promise<void>;
    uploadData(data: any[], query: string, rowMapper: (row: any) => any[]): Promise<void>;
}
