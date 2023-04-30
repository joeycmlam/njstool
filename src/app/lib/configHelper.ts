import { readFile } from 'fs/promises';
import * as yaml from 'js-yaml';

export interface Config {
    logLevel: string;
}

export class ConfigHelper {
    private config: Config | null = null;

    constructor(private configFilePath: string) {}

    async load(): Promise<void> {
        const configData = await readFile(this.configFilePath, 'utf-8');
        const configObj = yaml.load(configData);
        this.config = configObj as Config;
    }

    getConfig(): Config | null {
        return this.config;
    }
}
