
import  FeedConfig  from './feedConfig';
import * as fs from 'fs';
import * as path from 'path';
import DBConnection from '../lib/dbConnection';
import Logger from "../lib/logger";

export default class FeedGenerator {

  private logger: Logger = Logger.getInstance();

  constructor(private db: DBConnection, private config: FeedConfig) {}

  public async extractToFile(): Promise<void> {
    const result = await this.db.query(this.config.sql);
    const data = result.rows.map(row => JSON.stringify(row)).join('\n');
    const fullFilename = path.resolve(__dirname, this.config.fileName);
    fs.writeFileSync(fullFilename, data);
    const logger = this.logger;
    logger.info(`Data written to ${fullFilename}`);
  }
}