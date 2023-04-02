import logger from './logger';

const data = [
    {id: 1, name: 'J. Lam', email: 'joey.lam@exmple.com'},
    {id: 2, name: "P. Chan", email: 'peter.chan@example.com'}
];

function processData() {
    data.forEach((item) => {
        logger.info(`Processing user ${item.id}: ${item.name} with email ${item.email}`);
    });

    logger.info('password abc$1234 bank  3123-5930-977 testing')
    logger.info('Batch processing completed.');
}

processData();
