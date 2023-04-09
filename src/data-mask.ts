import {SyncRedactor} from 'redact-pii';
type Maskable = string | number | boolean;

export class DataMask {
    private static instance: DataMask;

    private redactor: SyncRedactor;

    private constructor() {
        this.redactor = new SyncRedactor({
            globalReplaceWith: '******',
            customRedactors: {
                before: [
                    {
                        regexpPattern: /password \s*(\S+)/,
                        replaceWith: 'password ******',
                    },
                ],
            },
        });
    }

    public static getInstance(): DataMask {
        if (!DataMask.instance) {
            DataMask.instance = new DataMask();
        }
        return DataMask.instance;
    }

    private isObject(value: any): value is Record<string, unknown> {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
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
                    maskedData[key] = `*****`;
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
