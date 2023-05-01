// import Logger from './logwinston';
import MaskedLogger from './jl-log4js';
import {DataMask} from "./data-mask";
import { BaseConfig, ConfigHelper } from '../lib/configHelper';

const file: string = 'src/app/app-mask/config.yaml';
const configHelper = new ConfigHelper(file);

(async () => {
    await configHelper.load();

})();

const config: BaseConfig | null = configHelper.getConfig();

if (config) {
    console.log('Log level:', config.logLevel);
} else {
    console.error('Failed to load config.');
}

const logLevel = config ? config.logLevel : 'info';

const logger = new MaskedLogger(logLevel);
const dataMask = new DataMask();


function testProcess() {
    const inputData = [
        {
            fullname: "Rodolfo Powlowski",
            holding: [
                [
                    {
                        fund_id: "AAISALTR",
                        units: 635775082.7578,
                        bank_account: "4716382092024800"
                    },
                    {
                        fund_id: "DCECSND1",
                        units: 436594334.7928,
                        bank_account: "4916245847168982"
                    }
                ]
            ]
        }
    ];

    const stringmsg : string = 'my bank account number is 43231-0998-1923'

    // const msg = dataMask.mask(inputData);

    logger.info('start');
    logger.warn('test');

    logger.debug(JSON.stringify(inputData));
    logger.info('end');
}

testProcess();
