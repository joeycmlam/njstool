import { BaseConfig } from "./configHelper";

export default interface LoggerConfig extends BaseConfig {
    level: string;
    filename: string;
}