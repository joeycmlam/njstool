import { SyncRedactor } from 'redact-pii';
const redactor = new SyncRedactor();

export class DataMasker {
    static datamask(message: any): any {
        const maskedMessage = redactor.redact(message);
        return maskedMessage;
    }
}
