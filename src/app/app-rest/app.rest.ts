// src/index.ts

import express, { Express} from 'express';
import bodyParser from 'body-parser';
import HealthCheckController from "./controllers/healthCheckController";
import FilesController from './controllers/FilesController';

class restApp {
    public app: Express;
    private healthCheckController: HealthCheckController;
    private filesController: FilesController;

    constructor(healthCheckController: HealthCheckController,
                filesController: FilesController) {
        this.app = express();
        this.healthCheckController = healthCheckController;
        this.filesController = filesController;
        this.initializeMiddleware();
        this.initializeControllers();
    }

    private initializeMiddleware(): void {
        this.app.use(bodyParser.json());

    }

    private initializeControllers(): void {
        this.app.get('/health', this.healthCheckController.getHealthCheck);
        this.app.get('/files/:fileName', this.filesController.getFileName); // Add new route
    }

    public listen(port: number): void {
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}

const PORT = 3000;
const healthCheckController = new HealthCheckController();
const filesController = new FilesController();
const instance = new restApp(healthCheckController, filesController);
if (require.main === module) {
    instance.listen(PORT);
}
export { instance };
