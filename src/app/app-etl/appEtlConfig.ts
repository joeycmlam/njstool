import DatabaseConfig from "../lib/configDatabase";
import {BaseConfig} from "../lib/configHelper";

export interface AppEtlConfig extends BaseConfig {
    database: DatabaseConfig;
    dataFilePath: {
        accountFile: string;
        holdingFile: string;
    }
}
