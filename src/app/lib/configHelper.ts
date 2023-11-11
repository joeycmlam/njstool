import * as yaml from 'js-yaml';
import * as fs from 'fs';


export interface BaseConfig {
    version: string;
    buildDate?: string;
    logLevel: any;
}

export class ConfigHelper {
    private config: BaseConfig | null = null;

    constructor(private configFilePath: string) { }

    load(): void {
        const configData = fs.readFileSync(this.configFilePath, 'utf-8');
        const configObj = yaml.load(configData);
        this.config = configObj as BaseConfig;
    }

    getConfig(): BaseConfig | null {
        return this.config;
    }
}
