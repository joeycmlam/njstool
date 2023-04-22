import Converter from "./maptest";


function main() : void {
    console.log ('start');
    const process = new Converter();
    process.convert();

    console.log ('done');
}

main();
