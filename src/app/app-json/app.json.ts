import JsonHelper from "./jsonHelper";
import path from "path";

class app {
    static async process() {
        console.log('main - start');
        const in_path: string = 'data/';
        const out_path: string = 'output';
        const infile: string = 'test.json';
        const outfile: string = 'out-1level.xlsx';

        const infilename: string = path.join(in_path, infile);
        const outfilename: string = path.join(out_path, outfile);
        const a = new JsonHelper();
        await a.processJsonfile(infilename);
        await a.write2excel(outfilename, 'sheet1');
        console.log('main - done');
    }
}

app.process();


