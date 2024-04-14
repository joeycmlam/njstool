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

type Holding {
  account_cd: String!
  stock_cd: String!
  exchange: String!
  unit: Float!
  book_cost: Float!
}

type Account {
  account_cd: String!
  account_nm: String!
  holdings: [Holding!]!
}

type Query {
  accounts(account_cd: String, account_nm: String, limit: Int, offSet: Int): [Account!]!
  holdings(account_cd: String, limit: Int, offSet: Int): [Holding!]!
}
`;

    // Define your resolvers
    // Define your resolver functions
    const resolvers = {
      Account: {
        holdings: async (parent: { account_cd: string }) => {
          const client = new Client(this.config.database);
    
          await client.connect();
    
          const query = 'SELECT * FROM holding WHERE account_cd = $1';
          const params = [parent.account_cd];
    
          const res = await client.query(query, params);
          await client.end();
    
          return res.rows;
        },
      },
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

          if (args.limit) {
            params.push(args.limit);
            query += ` LIMIT $${params.length}`;
          }

          if (args.offSet) {
            params.push(args.offSet);
            query += ` OFFSET $${params.length}`;
          }

          const res = await client.query(query, params);
          await client.end();
          
          this.logger.info('Query result:', res.rows);

          return res.rows;
        },
        holdings: async (_parent: any, args: { account_cd?: string, limit?: number, offset?: number }) => {
          const client = new Client(this.config.database);
    
          await client.connect();
    
          let query = 'SELECT * FROM holding WHERE 1=1';
          const params = [];
    
          if (args.account_cd) {
            params.push(args.account_cd);
            query += ` AND account_cd = $${params.length}`;
          }
    
          if (args.limit) {
            params.push(args.limit);
            query += ` LIMIT $${params.length}`;
          }
    
          if (args.offset) {
            params.push(args.offset);
            query += ` OFFSET $${params.length}`;
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

  private initConfig(): void {
        // Load configuration
    // Get the config file path from the command line arguments
    const args = minimist(process.argv.slice(2));
    const configFile = args.config || path.join(__dirname, 'config.json');
    this.config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  }

  private setupDatabase(): void {
    require('dotenv').config({ path: this.config.envfile });
    this.config.database.host = process.env.DB_HOST;
    this.config.database.port = process.env.DB_PORT;
    this.config.database.database = process.env.DB_NAME;
    this.config.database.user = process.env.DB_USER;
    this.config.database.password = process.env.DB_PASSWORD;

    this.logger.info('Database configuration: ', this.config.database);
  }

  private async init(): Promise<void> {

    this.initConfig();
    this.url = this.config.url;
    this.setupDatabase();
  }

  public async start(): Promise<void> {

    await this.init();
    this.startServer();
  }

}

const app = new App();
app.start();