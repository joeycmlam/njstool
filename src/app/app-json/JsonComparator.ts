import _ from 'lodash';
import fs from 'fs';
import path from 'path';

enum ComparisonResult {
  Match = 'Match',
  Unmatch = 'Unmatch'
}

export class JsonComparator {
  private resultsFile: string;

  constructor(resultsFile: string) {
    this.resultsFile = resultsFile;

    // Remove the file if it already exists
    if (fs.existsSync(this.resultsFile)) {
      fs.unlinkSync(this.resultsFile);
    }
  }

  compare(obj1: { [key: string]: any }, obj2: { [key: string]: any }, fieldName: string = ''): boolean {
    let isEqual = true;

    // If both are arrays, sort them and compare each item
    if (_.isArray(obj1) && _.isArray(obj2)) {
      const sortedObj1 = [...obj1].sort();
      const sortedObj2 = [...obj2].sort();
      for (let i = 0; i < Math.max(sortedObj1.length, sortedObj2.length); i++) {
        const item1 = sortedObj1[i];
        const item2 = sortedObj2[i];
        const itemIsEqual = item1 === item2;
        fs.appendFileSync(this.resultsFile, `${fieldName}[${i + 1}]|${itemIsEqual ? ComparisonResult.Match : ComparisonResult.Unmatch}|${JSON.stringify(item1)}|${JSON.stringify(item2)}\n`);
        if (!itemIsEqual) {
          isEqual = false;
        }
      }
    }
    // If both are objects, compare their properties
    else if (_.isObject(obj1) && _.isObject(obj2)) {
      for (const key in obj1) {
        if (!this.compare(obj1[key], obj2[key], key)) {
          isEqual = false;
        }
      }
    }
    // Otherwise, just compare the values
    else {
      isEqual = obj1 === obj2;
      fs.appendFileSync(this.resultsFile, `${fieldName}|${isEqual ? ComparisonResult.Match : ComparisonResult.Unmatch}|${JSON.stringify(obj1)}|${JSON.stringify(obj2)}\n`);
    }

    return isEqual;
  }

  compareFolders(folder1: string, folder2: string): void {
    const files1 = fs.readdirSync(folder1);
    const files2 = fs.readdirSync(folder2);

    for (const file1 of files1) {
      const file2 = files2.find(file => path.basename(file) === path.basename(file1));
      if (file2) {
        const json1 = JSON.parse(fs.readFileSync(path.join(folder1, file1), 'utf-8'));
        const json2 = JSON.parse(fs.readFileSync(path.join(folder2, file2), 'utf-8'));
        this.compare(json1, json2, path.basename(file1, '.json'));
      }
    }
  }
}