import fs from 'fs/promises';
import * as yaml from 'js-yaml';

export default class Config {
    private config: Map<string, any>;

    constructor(configPath: string) {
        this.config = new Map<string, any>();
        this.load(configPath);
    }

    private async load(configPath: string): Promise<void> {
        try {
            const fileContents = await fs.readFile(configPath, 'utf-8');
            const yamlConfig = await yaml.load(fileContents) as Record<string, any>;

            if (typeof yamlConfig === 'object' && yamlConfig !== null) {
                for (const key in yamlConfig) {
                    this.config.set(key, yamlConfig[key]);
                }
            }
        } catch (error) {
            console.error(`Error loading configuration file: ${configPath}`);
            console.error(error);
        }
    }

    public get(key: string): any {
        return this.config.get(key)!;
    }

    public has(key: string): boolean {
        return this.config.has(key);
    }
}

