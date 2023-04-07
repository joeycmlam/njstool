import fs from 'fs';
import * as yaml from 'js-yaml';

export interface Config {
    logLevel: string;
}

const configData = fs.readFileSync('./config.yaml', 'utf-8');
const config: Config = yaml.load(configData) as Config;

export default config;
