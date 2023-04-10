import {SyncRedactor} from 'redact-pii';
import * as cp from './constant';

export class DataMask {

    private redactor: SyncRedactor;

    constructor() {
        this.redactor = new SyncRedactor({
            globalReplaceWith: '******',
            customRedactors: {
                before: [
                    {
                        regexpPattern: cp.PATTERN_SENSITIVE_OBJECT,
                        replaceWith: cp.MASK,
                    },
                ],
            }
        });
    }

    private isObject(value: any): boolean {
        return value !== null && (typeof value === 'object' || Array.isArray(value))
    }

    private isMaskable(value: any): boolean {
        return (
            value !== null && typeof value === 'string'
        );
    }

    private maskObject<T>(input: T): T {
        const maskedData: any = Array.isArray(input) ? [...input] : {...input};

        for (const key in maskedData) {
            if (maskedData.hasOwnProperty(key)) {
                if (this.isMaskable(maskedData[key])) {
                    if (cp.PATTERN_SENSITIVE_STR.test(key)) {
                        maskedData[key] = '*****';
                    } else {
                        maskedData[key] = this.redactor.redact(maskedData[key].toString());
                    }
                } else if (this.isObject(maskedData[key])) {
                    maskedData[key] = this.maskObject(maskedData[key]);
                }
            }
        }
        return maskedData as T;
    }

    /**
     * This function is to mask the sensitive data to avoid any PII data.
     * For the preliminary data type including string which will use redact-pii library to do the data mask.
     * For the object, it will base the tag naming to determine whether it will do any masking
     * @data {any} it support vairous types including string, number and object
     **/
    public mask(data: any): any {
        let maskedData: any;

        if (this.isMaskable(data)) {
            maskedData = this.redactor.redact(data.toString());
        } if (this.isObject(data)) {
            maskedData = this.maskObject(data);
        }
        return maskedData;
    }
}
