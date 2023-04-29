import JsonHelper from "./jsonHelper";

class app {
    static async process() {
        console.log('main - start');
        const filename: string = 'test/test-json/features/test_data/test.json';
        const outfile: string = 'test/test-json/features/test_data/out-1level.xlsx';
        const a = new JsonHelper();
        await a.processJsonfile(filename);
        await a.write2excel(outfile, 'sheet1');
        console.log('main - done');
    }
}

app.process();


