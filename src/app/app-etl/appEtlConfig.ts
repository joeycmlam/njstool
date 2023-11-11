import DatabaseConfig from "../lib/configDatabase";
import {BaseConfig} from "../lib/configHelper";

export interface AppEtlConfig extends BaseConfig {
    dbConfigfile: string;
    dataFilePath: {
        accountFile: string;
        holdingFile: string;
    }
}
