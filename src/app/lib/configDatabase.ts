import { BaseConfig } from "./configHelper";

export default interface DatabaseConfig extends BaseConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}
