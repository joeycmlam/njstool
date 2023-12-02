import { JsonComparator } from './JsonComparator';
import { Logger } from '../lib/logger';
import { config } from './config';
import path from 'path';

function main() {
  const json1 = {
    name: "John",
    age: 30,
    cars: ["BMWV", "Ford",  "Fiat"]
  };

  const json2 = {
    name: "John",
    cars: ["Fiat", "BMW", "Ford"],
    age: 29,
  };

  Logger.getLogger().info('Comparing json1 and json2');
  const resultsFilePath = path.join(__dirname, config.resultsFile);
  const comparator = new JsonComparator(resultsFilePath);
  // comparator.compare(json1, json2);
  const folder1 = path.join(__dirname, config.folder1);
  const folder2 = path.join(__dirname, config.folder2);
  comparator.compareFolders(folder1, folder2);
  Logger.getLogger().info('Done');    
}

main();