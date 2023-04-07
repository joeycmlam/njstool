import logger from './logwinston';

const data = [
    {id: 1, name: 'J. Lam', email: 'jlam@test.com'},
    {id: 2, name: "Peter. Chan", email: 'chan@test.com'}
];

function processData() {

    try {
        logger.warn('start..')
        data.forEach((item) => {
            logger.info(`Processing user ${item.id}: ${item.name} with email ${item.email}`);
        });

        logger.info('password abc$1234 bank  3123-5930-977 testing')
        logger.info('Batch processing completed.');
    } catch (e: any) {
        logger.error(e.message);
    }

}

processData();
