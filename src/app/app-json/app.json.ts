import { JsonComparator } from './JsonComparator';
import { Logger } from '../lib/logger';
import { config } from './config';
import path from 'path';

function main() {
  const json1 = {
    name: "John",
    age: 30,
    cars: ["Ford", "BMW", "Fiat"]
  };

  const json2 = {
    name: "John",
    age: 30,
    cars: ["Fiat", "BMW", "Ford"]
  };

  Logger.getLogger().info('Comparing json1 and json2');
  const resultsFilePath = path.join(__dirname, config.resultsFile);
  const comparator = new JsonComparator(resultsFilePath);
  comparator.compare(json1, json2);
  Logger.getLogger().info('Done');    
}

main();