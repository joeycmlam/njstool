import { PdfComparator } from './PdfComparator';

async function main() {
    const file1 = 'path/to/your/first/file.pdf';
    const file2 = 'path/to/your/second/file.pdf';

    const areEqual = await PdfComparator.comparePdfFiles(file1, file2);

    if (areEqual) {
        console.log('The files are identical.');
    } else {
        console.log('The files are different.');
    }
}

main().catch(console.error);