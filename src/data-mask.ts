import {SyncRedactor} from 'redact-pii';
import * as cp from './custom-regexp-patterns';
type Maskable = string | number | boolean;

export class DataMask {

    private redactor: SyncRedactor;

     constructor() {
        this.redactor = new SyncRedactor({
            globalReplaceWith: '******',
            customRedactors: {
                before: [
                    {
                        regexpPattern: cp.sensitivePattern,
                        replaceWith: '******',
                    },
                ],
            },
        });
    }


    private isObject(value: any): value is Record<string, unknown> {
        return value !== null && (typeof value === 'object' || Array.isArray(value))
    }

    private isMaskable(value: any): value is Maskable {
        return (
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean'
        );
    }

    private maskObject<T>(input: T): T {
        const maskedData: any = Array.isArray(input) ? [...input] : { ...input };

        for (const key in maskedData) {
            if (maskedData.hasOwnProperty(key)) {
                if (this.isMaskable(maskedData[key])) {
                    if  (cp.sensitiveKeyPattern.test(key)) {
                        maskedData[key] = '*****';
                    }
                } else if (this.isObject(maskedData[key])) {
                    maskedData[key] = this.maskObject(maskedData[key]);
                }
            }
        }
        return maskedData as T;
    }

    public mask(data: any): any {
        let maskedData: any;

        if (this.isMaskable(data)) {
            maskedData = this.redactor.redact(data.toString());
        } else {
            maskedData = this.maskObject(data);
        }
        return maskedData;
    }
}
