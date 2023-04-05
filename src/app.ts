import logger from './loglog4js';

const data = [
    {id: 1, name: 'J. Lam', email: 'jlam@test.com'},
    {id: 2, name: "Peter. Chan", email: 'chan@test.com'}
];

function processData() {

    try {
        data.forEach((item) => {
            logger.info(`Processing user ${item.id}: ${item.name} with email ${item.email}`);
        });

        logger.info('password abc$1234 bank  3123-5930-977 testing')
        logger.info('Batch processing completed.');
    } catch (e: any) {
        logger.error(e.message);
    }

}

logger.info('this info - start');
logger.warn('this is warning');

processData();
