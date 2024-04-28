import fs from 'fs';
import readline from 'readline';
import iResult from './iResult';
import _ from 'lodash';

export default class FileComparator {
    private file1: string;
    private file2: string;

    constructor(file1: string, file2: string) {
        this.file1 = file1;
        this.file2 = file2;
    }



    public async compare(): Promise<iResult> {
        const result = {} as iResult;
    
        const file1Data = await this.readFileData(this.file1);
        const file2Data = await this.readFileData(this.file2);
    
        file1Data.sort();
        file2Data.sort();
    
        let matches = 0;
        let mismatches = 0;
        let unmatchedData = [];
    
        for (let i = 0; i < Math.max(file1Data.length, file2Data.length); i++) {
            if (_.isEqual(file1Data[i], file2Data[i])) {
                matches++;
            } else {
                mismatches++;
                let reason = '';
                if (file1Data[i] && !file2Data[i]) {
                    reason = 'Exists in file1 only';
                } else if (!file1Data[i] && file2Data[i]) {
                    reason = 'Exists in file2 only';
                } else {
                    reason = 'Both exist but one of the field not match';
                }
                unmatchedData.push({
                    rowId: i + 1,
                    reason: reason,
                    file1Data: file1Data[i],
                    file2Data: file2Data[i]
                });
            }
        }
    
        result.matches = matches;
        result.unmatches = mismatches;
        result.unmatchedData = unmatchedData;
    
        return result;
    }

    private async readFileData(file: string): Promise<string[]> {
        const fileStream = readline.createInterface({
            input: fs.createReadStream(file),
            terminal: false
        });

        let lines: string[] = [];
        let isFirstLine = true;

        for await (const line of fileStream) {
            if (isFirstLine) {
                isFirstLine = false;
                continue;
            }

            lines.push(line);
        }

        return lines;
    }
}