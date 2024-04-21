import DatabaseConfig from "../lib/configDatabase";
import { ConfigHelper } from "../lib/configHelper";
import DBPostgresQL from "../lib/dbPostgresQL";
import FeedConfig from "./feedConfig";
import FeedGenerator from "./feedGenerator";


(async () => {
  const dbConfigFile = "src/app/app-feed/config.db.yaml";
  const dbConfigHelper = new ConfigHelper(dbConfigFile);
  dbConfigHelper.load();
  const dbConfig = dbConfigHelper.getConfig() as DatabaseConfig;
  const fileFeed: FeedConfig =
  {
    fileName: "data/account.csv",
    sql: "select * from account",
    fieldDelimitor: "|"
  };

  const db = new DBPostgresQL(dbConfig);

  const generator = new FeedGenerator(db, fileFeed);
  await generator.extractToFile();
})();

