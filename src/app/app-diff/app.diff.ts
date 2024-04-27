import minimist from "minimist";
import path from "path";
import fs from "fs";
import Logger from "../lib/logger";
import FileComparator from "./FileComparator";
import { iBase } from "../app-interface/iBase";

interface iAppConfig extends iBase {
    path1: string;
    path2: string;
    files: {
        [key: string]: string;
    };

}


class App {

    private logger = Logger.getLogger();
    private config = {} as iAppConfig;
    
    constructor() {
    }

    private parseArgs() {
        const args = minimist(process.argv.slice(2));
        const configFile = args.config || path.join(__dirname, 'config.json');
        return configFile;
    }

    private readConfig(configFile: string) {
        try {
            const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
            return config;
        } catch (error) {
            this.logger.error('Error reading config file');
            process.exit(1);
        }
    }

    public run() {
        const configFile = this.parseArgs();
        this.config = this.readConfig(configFile);
        for (const file in this.config.files) {
            const file1 = path.join(this.config.path1, file);
            const file2 = path.join(this.config.path2, file);
            this.logger.info(`Comparing ${file1} and ${file2}`);
            const diff = new FileComparator(file1, file2);
            this.logger.info(diff);
    
        }

        
    }
}

const app = new App();
app.run();