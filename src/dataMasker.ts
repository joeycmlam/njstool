import { SyncRedactor } from 'redact-pii';
const redactor = new SyncRedactor();

export class DataMasker {
    static datamask(message: string): string {
        const maskedMessage = redactor.redact(message);
        return maskedMessage;
    }
}
