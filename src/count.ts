class Counter {


    public countToTen(): void {
        for (let i = 1; i <= 10; i++) {
            console.log(i);
        }
    }
}


const counter = new Counter();
counter.countToTen();
