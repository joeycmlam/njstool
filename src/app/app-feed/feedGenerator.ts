import * as fs from 'fs';
import pgPromise from 'pg-promise';
import { Parser } from 'json2csv';
import FeedConfig from './feedConfig'; // Define this interface according to your needs
import { ConfigHelper } from '../lib/configHelper';

export default class feedGenerator {
  private config: FeedConfig;
  private db: pgPromise.IDatabase<any>;

  constructor(configFile: string) {
    const configHelper = new ConfigHelper(configFile);
    this.config = configHelper.getConfig() as FeedConfig;

    const pgp = pgPromise();
    this.db = pgp(this.config.database);
  }


  async generateFeed() {
    // Run the SQL query
    const data = await this.db.any(this.config.sql);

    // Convert the data to the specified file format
    let fileData: string;
    switch (this.config.fileFormat) {
      case 'csv':
        const parser = new Parser();
        fileData = parser.parse(data);
        break;
      // Add more cases here for other file formats
      default:
        throw new Error(`Unsupported file format: ${this.config.fileFormat}`);
    }

    // Write the data to the feed file
    fs.writeFileSync(this.config.feedFile, fileData);
  }
}