import axios from 'axios';
import cheerio from 'cheerio'
import { injectable } from 'inversify';
import Logger from '../lib/logger';
import excelHelper from '../lib/excelHelper';

@injectable()
export class FundPriceDownloader {
    private logger = Logger.getLogger();

    constructor(
    ) { }

    public async run(): Promise<void> {
        this.logger.info('Start downloading fund prices');

        // Get fund prices
        const prices = await this.getFundPrices();
        this.logger.info(prices);

        this.logger.info('End downloading fund prices');
    }

    private async getFundPrices(): Promise<Array<{ id: string; name: string; date: string; price: number }>> {
        const url = 'https://www.manulifeim.com.hk/en/funds/fund-prices.html';
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        $('selector').each((index, element) => {
          const text = $(element).text();
          console.log(text);
        });

        return [];
      }
}
