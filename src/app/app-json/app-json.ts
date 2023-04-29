import JsonHelper from "./jsonHelper";

class app {
    static process() {
        console.log('main - start');
        const a = new JsonHelper();
        a.processJsonfile('data/test.json');
        a.write2excel('output/json.xlsx', 'sheet1');
        console.log('main - done');
    }
}

app.process();


