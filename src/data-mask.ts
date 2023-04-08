import {SyncRedactor} from 'redact-pii';

const redactor = new SyncRedactor({globalReplaceWith: '******'});



export class dataMask {


    static mask(data: any): any {

        if (typeof data === 'object') {
            const jsonData = JSON.stringify(data);
            return JSON.parse(redactor.redact(jsonData));
        } else {
            return redactor.redact(data);
        }

    }
}
