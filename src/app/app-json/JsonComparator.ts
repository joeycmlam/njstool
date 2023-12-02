import _ from 'lodash';
import fs from 'fs';

export class JsonComparator {
  private resultsFile: string;

  constructor(resultsFile: string) {
    this.resultsFile = resultsFile;
  }

  compare(obj1: { [key: string]: any }, obj2: { [key: string]: any }, fieldName: string = ''): boolean {
    // If both are arrays, sort them and compare
    if (_.isArray(obj1) && _.isArray(obj2)) {
      const isEqual = _.isEqual(obj1.sort(), obj2.sort());
      fs.appendFileSync(this.resultsFile, `${fieldName}|${isEqual ? 'Match' : 'Unmatch'}|${JSON.stringify(obj1)}|${JSON.stringify(obj2)}\n`);
      return isEqual;
    }

    // If both are objects, compare their properties
    if (_.isObject(obj1) && _.isObject(obj2)) {
      for (const key in obj1) {
        if (!this.compare(obj1[key], obj2[key], key)) {
          return false;
        }
      }
      return true;
    }

    // Otherwise, just compare the values
    const isEqual = obj1 === obj2;
    fs.appendFileSync(this.resultsFile, `${fieldName}|${isEqual ? 'Match' : 'Unmatch'}|${JSON.stringify(obj1)}|${JSON.stringify(obj2)}\n`);
    return isEqual;
  }
}