
import { Request, Response } from 'express';

export default class HealthCheckController {
    private buildDate: string;
    private version: string;

    constructor() {
        this.buildDate = new Date().toISOString();
        this.version = '1.0.0';
    }

    public getHealthCheck = (req: Request, res: Response): void => {
        const uptime = process.uptime();
        res.status(200).json({
            status: 'OK',
            buildDate: this.buildDate,
            version: this.version,
            uptime: `${uptime.toFixed(2)} seconds`,
        });
    };
}
