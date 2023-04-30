
export class app {

    static async process() {

    }
}

async function main() {
    console.log('x-start');
    try {
        await app.process();
    } catch (error) {
        console.error('An error occurred:', error);
    }
    console.log('x-end');
}

main();
