import Logger from './logwinston';
import config from './config';
import {DataMask} from "./data-mask";


const logger = new Logger(config.logLevel);
const dataMask = DataMask.getInstance();

const data = [
    {id: 1, name: 'J. Lam', email: 'jlam@test.com'},
    {id: 2, name: "Peter. Chan", email: 'chan@test.com'},
    {
        lastname: "Chan",
        firstname: "KK",
        address: {
            "key4": "lam@gmail.com"
        }
    }

];


function testObject() {
    const inputData = [
            {
                "full name": "Grant Wilderman",
                "address": {
                    "street": "08958 Lolita Overpass",
                    "city": "São Caetano de Odivelas"
                },
                "email": "Grant25@gmail.com",
                "holding": [
                    [
                        {
                            "fund_id": "ABKFDKK1",
                            "units": 474131956.8843,
                            "bank_account": "5359920713611049"
                        }
                    ],
                    [
                        {
                            "fund_id": "BEACTDND220",
                            "units": 360940134.4492,
                            "bank_account": "4716099551299521"
                        }
                    ]
                ]
            }
        ]

    ;

    const msg = dataMask.mask(inputData);
    console.log(msg);

}

function processData() {


    logger.warn('start..')
    data.forEach((item) => {
        logger.debug(JSON.stringify(item));
    });

    logger.info('password abc$1234 bank  3123-5930-977 testing')
    logger.info('Batch processing completed.');


}

// processData();
testObject();
