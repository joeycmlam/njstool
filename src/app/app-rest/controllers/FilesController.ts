import { Request, Response } from 'express';

export default class FilesController {
    public getFileName = (req: Request, res: Response): void => {
        const { fileName } = req.params;
        res.status(200).json({ message: `File name: ${fileName}` });
    };
}
