import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import Logger from '../lib/logger';
import minimist from 'minimist';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

class AppClient {
  private logger = Logger.getLogger();

  private config: any = {};

  public constructor() {
  }

  private initConfig(): void {
    // Load configuration
    // Get the config file path from the command line arguments
    const args = minimist(process.argv.slice(2));
    const configFile = args.config || path.join(__dirname, 'config.json');
    this.config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  }

  public run() {
    this.getDataFromService();
  }

  private async getDataFromService() {

    this.initConfig();

    const client = new ApolloClient({
      uri: this.config.url,
      cache: new InMemoryCache()
    });

    let offset = 0;
    const limit = 10;



      const GET_ACCOUNTS = gql`
      query GetAccounts {
        accounts (limit: $limit, offSet: $offset) {
          account_cd
          account_nm
        }
      }
    `;

      try {
        const { data } = await client.query({ query: GET_ACCOUNTS, variables: { limit, offset } });
        this.logger.log(data.accounts);
      } catch (error) {
        this.logger.error('Error:', error);
      }

      offset += limit;

      this.logger.log('records:', offset);
      // await promisify(setTimeout)(1000);
    
  }

}


const app = new AppClient();
app.run();

