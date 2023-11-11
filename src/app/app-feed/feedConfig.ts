import { BaseConfig } from "../lib/configHelper";

export default interface FeedConfig extends BaseConfig {
    database: string;
    sql: string;
    fileFormat: string;
    feedFile: string;
  }