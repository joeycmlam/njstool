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

  compareValues(value1: any, value2: any, fileName: string, fieldName: string): boolean {
    const isEqual = value1 === value2;
    this.writeResultDetails(fileName, fieldName, isEqual, value1, value2);
    return isEqual;
  }

  compareObjects(obj1: { [key: string]: any }, obj2: { [key: string]: any }, fileName: string, fieldName: string): boolean {
    let isEqual = true;

    // ...
    for (const key in obj1) {
      if (!this.compare(obj1[key], obj2[key], key, fileName)) {
        isEqual = false;
      }
    }

    return isEqual;
  }

  compareArrays(obj1: any[], obj2: any[], fileName: string, fieldName: string): boolean {
    let isEqual = true;

    // ...
    const sortedObj1 = [...obj1].sort();
    const sortedObj2 = [...obj2].sort();
    for (let i = 0; i < Math.max(sortedObj1.length, sortedObj2.length); i++) {
      const item1 = sortedObj1[i];
      const item2 = sortedObj2[i];
      const itemIsEqual = item1 === item2;
      this.writeResultDetails(fileName, `${fieldName}[${i + 1}]`, itemIsEqual, item1, item2);
      if (!itemIsEqual) {
        isEqual = false;
      }
    }
    return isEqual;
  }

  compare(obj1: { [key: string]: any }, obj2: { [key: string]: any },fieldName: string = '', fileName: string ): boolean {
    if (_.isArray(obj1) && _.isArray(obj2)) {
      return this.compareArrays(obj1, obj2, fileName, fieldName);
    } else if (_.isObject(obj1) && _.isObject(obj2)) {
      return this.compareObjects(obj1, obj2, fileName, fieldName);
    } else {
      return this.compareValues(obj1, obj2, fileName, fieldName);
    }
  }

  compareFolders(folder1: string, folder2: string): void {
    this.writeHeader();

    const files1 = fs.readdirSync(folder1);
    const files2 = fs.readdirSync(folder2);

    for (const file1 of files1) {
      const file2 = files2.find(file => path.basename(file) === path.basename(file1));
      if (file2) {
        const json1 = JSON.parse(fs.readFileSync(path.join(folder1, file1), 'utf-8'));
        const json2 = JSON.parse(fs.readFileSync(path.join(folder2, file2), 'utf-8'));
        this.compare(json1, json2, path.basename(file1, '.json'), file1);
      }
    }
  }


  writeHeader(): void {
    fs.writeFileSync(this.resultsFile, 'FileName|FieldName|ComparisonResult|Value1|Value2\n');
  }

  writeResultDetails(fileName: string, fieldName: string, isEqual: boolean, value1: any, value2: any): void {
    fs.appendFileSync(this.resultsFile, `${fileName}|${fieldName}|${isEqual ? ComparisonResult.Match : ComparisonResult.Unmatch}|${JSON.stringify(value1)}|${JSON.stringify(value2)}\n`);
  }

}