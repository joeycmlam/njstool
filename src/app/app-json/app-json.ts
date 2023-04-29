import JsonHelper from "./jsonHelper";

class app {
    static async process() {
        console.log('main - start');
        const a = new JsonHelper();
        await a.processJsonfile('data/test2level.json');
        await a.write2excel('output/json-2level.xlsx', 'sheet1');
        console.log('main - done');
    }
}

app.process();


