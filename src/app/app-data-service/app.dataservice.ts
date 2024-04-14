// server.ts
import { ApolloServer, gql } from 'apollo-server';
import minimist from 'minimist';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import Logger from '../lib/logger';

class App {
  private logger = Logger.getLogger();
  private url: string = '';
  private config: any = {};

  constructor() {
  }

  private startServer(): void {
    // Define your schema
    const typeDefs = gql`
type Account {
  account_cd: String!
  account_nm: String!
}

type Query {
  accounts(account_cd: String): [Account!]!
}
`;

    // Define your resolvers
    // Define your resolver functions
    const resolvers = {
      Query: {
        accounts: async (_parent: any, args: any) => {
          const client = new Client(this.config.database);

          await client.connect();

          let query = 'SELECT * FROM account WHERE 1=1';
          const params = [];

          if (args.account_cd) {
            params.push(args.account_cd);
            query += ` AND account_cd = $${params.length}`;
          }

          if (args.account_nm) {
            params.push(`%${args.account_nm}%`);
            query += ` AND account_nm LIKE $${params.length}`;
          }

          const res = await client.query(query, params);
          await client.end();

          return res.rows;
        },
      },
    };

    // Create the Apollo Server
    const server = new ApolloServer({ typeDefs, resolvers });

    // Start the server
    server.listen().then(({ url }) => {
      console.log(`Server ready at ${url}`);
    });
  }

  private async init(): Promise<void> {
    // Load configuration
    // Get the config file path from the command line arguments
    const args = minimist(process.argv.slice(2));
    const configFile = args.config || path.join(__dirname, 'config.json');
    this.config = JSON.parse(fs.readFileSync(configFile, 'utf8'));

    this.url = this.config.url;

    require('dotenv').config({ path: this.config.envfile });
    this.config.database.host = process.env.DB_HOST;
    this.config.database.port = process.env.DB_PORT;
    this.config.database.database = process.env.DB_NAME;
    this.config.database.user = process.env.DB_USER;
    this.config.database.password = process.env.DB_PASSWORD;

    this.logger.info('Database configuration: ', this.config.database);
  }

  public async start(): Promise<void> {

    await this.init();
    this.startServer();
  }

}

const app = new App();
app.start();