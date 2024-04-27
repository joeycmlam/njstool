import fs from 'fs';
import readline from 'readline';
import iResult from './iResult';

export default class FileComparator {
    private file1: string;
    private file2: string;

    constructor(file1: string, file2: string) {
        this.file1 = file1;
        this.file2 = file2;
    }

    async compare(): Promise<iResult> {
        const result = {} as iResult;

        const file1Data = await this.readFileData(this.file1);
        const file2Data = await this.readFileData(this.file2);

        file1Data.sort();
        file2Data.sort();

        let matches = 0;
        let mismatches = 0;

        for (let i = 0; i < Math.min(file1Data.length, file2Data.length); i++) {
            if (file1Data[i] === file2Data[i]) {
                matches++;
            } else {
                mismatches++;
            }
        }

        mismatches += Math.abs(file1Data.length - file2Data.length);
        
        result.matches = matches;
        result.unmatches = mismatches;

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