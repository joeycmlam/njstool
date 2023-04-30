import Converter from "./maptest";
import configHelper from "../lib/configHelper";


const data = [
    {name: 'name-1', repo: 'repo-1', date: '2023-01-01', rate: 2},
    {name: 'name-1', repo: 'repo-1', date: '2023-01-02', rate: 3},
    {name: 'name-2', repo: 'repo-1', date: '2023-01-01', rate: 2},
    {name: 'name-2', repo: 'repo-1', date: '2023-01-02', rate: 3},
    {name: 'name-2', repo: 'repo-2', date: '2023-01-02', rate: 1}
];




async function main()  {
    console.log ('start');

    const confg = new configHelper('src/app/app-mask/config.yaml');
    await confg.load();
    const fileName: string = confg.getString('output_excel');

    const process = new Converter(data);
    await process.getStatistic();

    await process.write2Excelfile(fileName);
    console.log ('done');
}

(async () => {
    console.log('x-start');
    await main();
    console.log('x-end');
})();

