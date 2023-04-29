import JsonHelper from "./jsonHelper";

class app {
    static async process() {
        console.log('main - start');
        const a = new JsonHelper();
        await a.processJsonfile('data/test.json');
        await a.write2excel('output/json.xlsx', 'sheet1');
        console.log('main - done');
    }
}

app.process();


