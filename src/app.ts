// import { promisify } from 'util';
//
// function countTask(n: number): Promise<number> {
//     console.log(n);
//     // retrun n;
//     return Promise.resolve(n);
// }
//
// const numbers: number[] = [];
// for (let i = 1; i <= 10; i++) {
//     numbers.push(i);
// }
//
// async function runCounting() {
//     const promisifiedCountTask = promisify(countTask);
//     try {
//
//         await Promise<number>(numbers.map(async(n) => await promisifiedCountTask(n)));
//         console.log('Counting complete!');
//
//     } catch (err) {
//         console.error(err);
//     }
// }
//
// runCounting();
