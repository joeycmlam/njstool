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
                "full name": "Doris Tillman",
                "address": {
                    "street": "4152 Doyle Inlet",
                    "city": "Ramnagar"
                },
                "email": "Doris.Tillman@hotmail.com"
            },
            {
                "full name": "Miriam Quitzon",
                "address": {
                    "street": "528 Esta Key",
                    "city": "Lambayeque"
                },
                "email": "Miriam30@hotmail.com"
            },
            {
                "full name": "Rosalie Johnson",
                "address": {
                    "street": "91042 August Trafficway",
                    "city": "Cockburn Town"
                },
                "email": "Rosalie95@yahoo.com"
            }
        ]
    ;

    const msg = dataMask.mask(inputData);

    logger.debug(JSON.stringify(msg));
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
