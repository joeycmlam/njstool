import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import Logger from '../lib/logger';

class AppClient {
  private logger = Logger.getLogger();
  public constructor () {
  }
  
  private async getDataFromService() {
    const client = new ApolloClient({
      uri: 'http://localhost:4000/graphql',
      cache: new InMemoryCache()
    });
  
    const GET_ACCOUNTS = gql`
      query GetAccounts {
        accounts {
          account_cd
          account_nm
        }
      }
    `;
  
    try {
      const { data } = await client.query({ query: GET_ACCOUNTS });
      this.logger.log(data.accounts);
    } catch (error) {
      this.logger.error('Error:', error);
    }
  }

  public run() {
    this.getDataFromService();
  }
}


const app = new AppClient();
app.run();