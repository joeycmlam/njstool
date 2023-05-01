import * as fs from "fs/promises";


export default class FileHelper {

    public static async readFile(fileName: string): Promise<any> {
        const data: any = await fs.readFile(fileName);
    }
}
