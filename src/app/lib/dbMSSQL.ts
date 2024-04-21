import { ConnectionPool, IResult, config as MSSQLConfig } from 'mssql';
import { iDatabase } from "../app-interface/iRDMBS";
import Logger from './logger';

export default class DBMSSQL implements iDatabase {
    private pool: ConnectionPool;
    private logger;

    constructor(connectionConfig: MSSQLConfig) {
        this.pool = new ConnectionPool(connectionConfig);
        this.logger = Logger.getLogger();
    }
    truncateTable(tableName: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    uploadData(data: any[], query: string, rowMapper: (row: any) => any[]): Promise<void> {
        throw new Error('Method not implemented.');
    }
    bulkUpload(data: any[], tableName: string, columnName: string[], rowMapper: (row: any) => any[]): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public async connect() {
        await this.pool.connect();
    }

    public async disconnect() {
        await this.pool.close();
    }

    public async query(query: string, params?: any[]): Promise<IResult<any>> {
        let res;
        try {
            const request = this.pool.request();
            if (params) {
                params.forEach((param, index) => {
                    request.input(`param${index}`, param);
                });
            }
            res = await request.query(query);
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
        return res;
    }
}