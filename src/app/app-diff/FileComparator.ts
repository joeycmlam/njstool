import fs from 'fs';
import readline from 'readline';

export default class FileComparator {
    private file1: string;
    private file2: string;

    constructor(file1: string, file2: string) {
        this.file1 = file1;
        this.file2 = file2;
    }

    async compare() {
        const file1Stream = readline.createInterface({
            input: fs.createReadStream(this.file1),
            output: process.stdout,
            terminal: false
        });

        const file2Stream = readline.createInterface({
            input: fs.createReadStream(this.file2),
            output: process.stdout,
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

        let matchCount = 0;
        let mismatchCount = 0;
        let mismatchRows: [number, string, string][] = [];

        for (let i = 0; i < Math.min(file1Lines.length, file2Lines.length); i++) {
            if (file1Lines[i] === file2Lines[i]) {
                matchCount++;
            } else {
                mismatchCount++;
                mismatchRows.push([i, file1Lines[i], file2Lines[i]]);
            }
        }

        if (file1Lines.length !== file2Lines.length) {
            mismatchCount += Math.abs(file1Lines.length - file2Lines.length);
        }

        return {
            totalMatch: matchCount,
            totalMismatch: mismatchCount,
            mismatchRows: mismatchRows
        };
    }
}