import { Client } from 'pg';

export default class PostgresUploader {
    private client: Client;
    constructor(connectionConfig: any) {
        this.client = new Client(connectionConfig);
    }

    async connect() {
        await this.client.connect();
    }

    async disconnect() {
        await this.client.end();
    }

    async uploadData(data: any, query: any, valueMapper: any) {

        for (const row of data) {
            await this.client.query(query, valueMapper(row));
        }
    }
}
