import { setWorldConstructor } from '@cucumber/cucumber';

export default class CustomWorld {
    public path: string;
    public jsonFile: string;
    public expectedFile: string;
    public actualFile: string;
}

setWorldConstructor(CustomWorld);
