import {SyncRedactor} from 'redact-pii';

const redactor = new SyncRedactor();

export class DataMasker {
    static mask(message: any): String {

        let msg: string;
        if (typeof message === 'string') {
            msg = message;

        } else {
            msg = JSON.stringify(message);
        }

        const maskedMessage = redactor.redact(msg);
        return maskedMessage;
    }
}
