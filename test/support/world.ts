import { setWorldConstructor } from '@cucumber/cucumber';

export default class CustomWorld {
    public rootPath: string;
    public jsonFile: string;
    public generatedExcelFile: string;
    public expectedFile: string;
}

setWorldConstructor(CustomWorld);
