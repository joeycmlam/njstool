import { Client } from 'pg';

export default class PostgresUploader {
    private client: Client;
    constructor(connectionConfig: Client) {
        this.client = new Client(connectionConfig);
    }

    async connect() {
        await this.client.connect();
    }

    async disconnect() {
        await this.client.end();
    }

    async uploadData(data, query, valueMapper) {
        for (const row of data) {
            await this.client.query(query, valueMapper(row));
        }
    }
}
