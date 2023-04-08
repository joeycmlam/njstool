import {SyncRedactor} from 'redact-pii';
import * as cp from './custom-regexp-patterns';

const redactor = new SyncRedactor({
    globalReplaceWith: '******',
    customRedactors: {
    before: [
        {
            // regexpPattern:  /(pass(word|phrase)?|secret) \S+/gi,
            regexpPattern: cp.password_a1,
            replaceWith: '******'
        }
    ]
    }});



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
