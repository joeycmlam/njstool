import Converter from "./maptest";
import Config from '../lib/Config';

const data = [
    {name: 'name-1', repo: 'repo-1', date: '2023-01-01', rate: 2},
    {name: 'name-1', repo: 'repo-1', date: '2023-01-02', rate: 3},
    {name: 'name-2', repo: 'repo-1', date: '2023-01-01', rate: 2},
    {name: 'name-2', repo: 'repo-1', date: '2023-01-02', rate: 3},
    {name: 'name-2', repo: 'repo-2', date: '2023-01-02', rate: 1}
];


const config = new Config('src/app/app-map/config.yaml');

async function main()  {
    console.log ('start');

    const process = new Converter(data);
    process.getStatistic();
    const fileName: string = config.get('output_excel');
    process.write2Excelfile(fileName);
    console.log ('done');
}

main();
