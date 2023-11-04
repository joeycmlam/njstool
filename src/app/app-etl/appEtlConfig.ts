import {BaseConfig} from "../lib/configHelper";

export interface AppEtlConfig extends BaseConfig {
    database: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
    };
    dataFilePath: {
        accountFile: string;
        holdingFile: string;
    }
}
