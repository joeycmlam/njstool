// src/index.ts

import express, { Express} from 'express';
import bodyParser from 'body-parser';
import HealthCheckController from "./controllers/healthCheckController";

class restApp {
    public app: Express;
    private healthCheckController: HealthCheckController;

    constructor(healthCheckController: HealthCheckController) {
        this.app = express();
        this.healthCheckController = healthCheckController;
        this.initializeMiddleware();
        this.initializeControllers();
    }

    private initializeMiddleware(): void {
        this.app.use(bodyParser.json());
    }

    private initializeControllers(): void {
        this.app.get('/health', this.healthCheckController.getHealthCheck);
    }

    public listen(port: number): void {
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}

const PORT = 3000;
const healthCheckController = new HealthCheckController();
const instance = new restApp(healthCheckController);
if (require.main === module) {
    instance.listen(PORT);
}
export { instance };
