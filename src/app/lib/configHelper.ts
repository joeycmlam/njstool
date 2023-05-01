import { readFile } from 'fs/promises';
import * as yaml from 'js-yaml';

export interface BaseConfig {
    version: string;
    buildDate?: string;
    logLevel: any;
}

export class ConfigHelper {
    private config: BaseConfig | null = null;

    constructor(private configFilePath: string) {}

    async load(): Promise<void> {
        const configData = await readFile(this.configFilePath, 'utf-8');
        const configObj = yaml.load(configData);
        this.config = configObj as BaseConfig;
    }

    getConfig(): BaseConfig | null {
        return this.config;
    }
}
