import Logger from './logwinston';
import config from './config';
import {DataMask} from "./data-mask";


const logger = new Logger(config.logLevel);
const dataMask = new DataMask();


function testProcess() {
    const inputData = [
        {
            fullname: "Rodolfo Powlowski",
            address: {
                credit_card: "4916677121340731",
                street: "464 Carlee Island",
                city: "Kara-Bak"
            },
            email: "Rodolfo_Powlowski@hotmail.com",
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

    const msg = dataMask.mask(inputData);

    // console.debug(msg);
    logger.debug(JSON.stringify(msg));

}

testProcess();
