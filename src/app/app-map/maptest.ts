

const data = [
    {name: 'name-1', date: '2023-01-01', rate: 2},
    {name: 'name-1', date: '2023-01-02', rate: 3},
    {name: 'name-2', date: '2023-01-01', rate: 2},
    {name: 'name-2', date: '2023-01-02', rate: 3},
    {name: 'name-2', date: '2023-01-02', rate: 1}
];

export interface commitCounter {
    name: string,
    date: string,
    rate: number
}

export default class Converter {
    private counters: Map<string, number>;

    constructor() {
        this.counters = new Map();
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
            console.log (`name: [${key}] rate: [${value}]`)
        }
    }
}
