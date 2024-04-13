import { Container, injectable } from 'inversify';
import Logger from '../lib/logger';
import minimist from 'minimist';
import path from 'path';
import fs from 'fs';
import { FundPriceDownloader } from './FundPriceDownloader';

@injectable()
class App {
    private logger = Logger.getLogger();

    constructor() {

    }

    private init(): void {
        // Load configuration
        // Get the config file path from the command line arguments
        const args = minimist(process.argv.slice(2));
        const configFile = args.config || path.join(__dirname, 'config.json');
        const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        Logger.configure(config.logger);

    }

    public async run() {

        this.init();
        this.logger.info('Start');
        const a = new FundPriceDownloader();
        await a.run();
        this.logger.info('End');
    }


}

const container = new Container();
const app = container.resolve(App);
app.run();
