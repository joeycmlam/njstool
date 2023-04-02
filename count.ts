class Counter {


    public countToTen(n: number): void {
        for (let i = 1; i <= n; i++) {
            console.log(i);
        }
    }
}


const counter = new Counter();
counter.countToTen(5);
