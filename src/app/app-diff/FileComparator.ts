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

        const file1Stream = readline.createInterface({
            input: fs.createReadStream(this.file1),
            terminal: false
        });

        const file2Stream = readline.createInterface({
            input: fs.createReadStream(this.file2),
            terminal: false
        });

        let file1Lines: string[] = [];
        for await (const line of file1Stream) {
            file1Lines.push(line);
        }

        let file2Lines: string[] = [];
        for await (const line of file2Stream) {
            file2Lines.push(line);
        }

        let matches = 0;
        let mismatches = 0;

        for (let i = 0; i < Math.min(file1Lines.length, file2Lines.length); i++) {
            if (file1Lines[i] === file2Lines[i]) {
                matches++;
            } else {
                mismatches++;
            }
        }

        mismatches += Math.abs(file1Lines.length - file2Lines.length);

        result.matches = matches;
        result.unmatches = mismatches;
        return result;

    }
}