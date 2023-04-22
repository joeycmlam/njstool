import { commitCounter } from "./iCommit";
import { Workbook } from "exceljs";


export default class Converter {
    private counters: Map<string, number>;
    private commits: Map<string, commitCounter>;
    private data;

    constructor(_data: any) {
        this.counters = new Map();
        this.commits = new Map();
        this.data = _data;
    }

    public async convert() {
        for (const aRecord of this.data) {
            if (this.counters.has(aRecord.name)) {
                this.counters.set(aRecord.name, this.counters.get(aRecord.name)! + aRecord.rate);
            } else {
                this.counters.set(aRecord.name, aRecord.rate);
            }
        }

    }

    public async getStatistic(): Promise<void> {
        for (const aRecord of this.data) {
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

    }

    public async write2Excelfile(fileName: string) {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet("Commit Stats");

        worksheet.columns = [
            { header: "Date", key: "date", width: 15 },
            { header: "Author", key: "author", width: 30 },
            { header: "Commit Count", key: "commitCount", width: 15 },
        ];

        for (let [key, value] of this.commits) {
            worksheet.addRow({date: value.date, author: value.name, commitCount: value.rate });
        }

        await workbook.xlsx.writeFile(fileName);
    }

}
