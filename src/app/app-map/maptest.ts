import {commitCounter} from "./iCommit";
import {mkdtemp} from "fs";

const data = [
    {name: 'name-1', repo: 'repo-1', date: '2023-01-01', rate: 2},
    {name: 'name-1', repo: 'repo-1', date: '2023-01-02', rate: 3},
    {name: 'name-2', repo: 'repo-1', date: '2023-01-01', rate: 2},
    {name: 'name-2', repo: 'repo-1', date: '2023-01-02', rate: 3},
    {name: 'name-2', repo: 'repo-2', date: '2023-01-02', rate: 1}
];


export default class Converter {
    private counters: Map<string, number>;
    private commits: Map<string, commitCounter>;

    constructor() {
        this.counters = new Map();
        this.commits = new Map();
    }

    public async convert() {
        for (const aRecord of data) {
            if (this.counters.has(aRecord.name)) {
                this.counters.set(aRecord.name, this.counters.get(aRecord.name)! + aRecord.rate);
            } else {
                this.counters.set(aRecord.name, aRecord.rate);
            }
        }

        for (let [key, value] of this.counters) {
            console.log(`name: [${key}] rate: [${value}]`)
        }
    }


    public async getStatistic(): Promise<void> {
        for (const aRecord of data) {
            const key = aRecord.name + '-' + aRecord.date;
            let tmpRecord: commitCounter;
            if (this.commits.has(key)) {
                tmpRecord = this.commits.get(key)!;
                tmpRecord.rate = tmpRecord.rate + aRecord.rate;
            } else {
                tmpRecord = {name: aRecord.name, date: aRecord.date, rate: aRecord.rate};
            }
            this.commits.set(key, tmpRecord);
        }

        for (let [key, value] of this.commits) {
            console.log (`name: [${value.name}] date: [${value.date}] rate: [${value.rate}]`);
        }
    }
}
