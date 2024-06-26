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

  compareValues(value1: any, value2: any, fileName: string, fieldName: string): ComparisonResult {
    let result: ComparisonResult;
    if ( value1 === value2) {
      result = ComparisonResult.Match;
    } else {
      result = ComparisonResult.Unmatch;
    }
    
    this.writeResultDetails(fileName, fieldName, result, value1, value2);
    return result;
  }

  compareObjects(obj1: { [key: string]: any }, obj2: { [key: string]: any }, fileName: string, fieldName: string): ComparisonResult {
    let isEqual = ComparisonResult.Match;

    // ...
    for (const key in obj1) {
      if (!this.compare(obj1[key], obj2[key], key, fileName)) {
        isEqual = ComparisonResult.Unmatch;
      }
    }

    return isEqual;
  }

  compareArrays(obj1: any[], obj2: any[], fileName: string, fieldName: string): ComparisonResult {
    let result: ComparisonResult = ComparisonResult.Match;

    // ...
    const sortedObj1 = [...obj1].sort();
    const sortedObj2 = [...obj2].sort();
    for (let i = 0; i < Math.max(sortedObj1.length, sortedObj2.length); i++) {
      const item1 = sortedObj1[i];
      const item2 = sortedObj2[i];
      let itemResult: ComparisonResult;
      if (item1 === item2) {
        itemResult = ComparisonResult.Match;
      } else {
        itemResult = ComparisonResult.Unmatch;
        result = itemResult;
      }
      this.writeResultDetails(fileName, `${fieldName}[${i + 1}]`, itemResult, item1, item2);
    }

    return result;
  }

  compare(obj1: { [key: string]: any }, obj2: { [key: string]: any },fieldName: string = '', fileName: string ): ComparisonResult {
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

  writeResultDetails(fileName: string, fieldName: string, result: ComparisonResult, value1: any, value2: any): void {
    fs.appendFileSync(this.resultsFile, `${fileName}|${fieldName}|${result}|${JSON.stringify(value1)}|${JSON.stringify(value2)}\n`);
  }

}