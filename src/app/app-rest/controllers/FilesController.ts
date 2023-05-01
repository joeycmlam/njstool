import {Request, Response} from 'express';
import JsonHelper from "../../app-json/jsonHelper";
import path from "path";

export default class FilesController {
    private filename: string;
    private result: any;
    private datapath: string;

    constructor() {
        this.datapath = 'data';
        this.filename = '';
    }

    public getFile = async (req: Request, res: Response): Promise<void> => {
        const {fileName} = req.params;
        this.filename = path.join(this.datapath, fileName);
        await this.process();
        res.status(200).json({message: this.result});
    };

    private async process() {
        const a = new JsonHelper();
        try {
            await a.processJsonfile(this.filename);
            this.result = a.getData();
        } catch (error: any) {
            this.result = {error: error.message};
        }
    }
}
