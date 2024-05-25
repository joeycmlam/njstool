import DSCCalculator, { DSCSchedule } from "./DSCCalculator.ts.backup";
import {orderTxnType, orderType} from "./typeFeeEngine";
import { enumOrdType } from "./enumFeeEngine";
import FIFOHoldingPeriodCalculator from "./FIFOHoldingPeriodCalculator.ts.backup";
import  Logger from "../lib/logger";
import { Container, injectable } from "inversify";

@injectable()
class app {
    private logger = Logger.getLogger();

    constructor() {
    }

    async run() {
        this.logger.info('process.start');
        // Example usage:
        const transactions: orderTxnType[] = [
            { orderDetail: { referenceId: 'T00001', accountId: 'A0001', orderDate: new Date('2019-01-01'), orderType: enumOrdType.SUBSCRIPTION, orderUnitAmount: 100, ordrStatus: 'Completed' }, dealingDate: new Date('2019-01-01'), settlementDate: new Date('2019-01-03') },
            { orderDetail: { referenceId: 'T00002', accountId: 'A0001', orderDate: new Date('2020-06-01'), orderType: enumOrdType.SUBSCRIPTION, orderUnitAmount: 50, ordrStatus: 'Completed' }, dealingDate: new Date('2020-06-01'), settlementDate: new Date('2020-06-03') },
            { orderDetail: { referenceId: 'T00003', accountId: 'A0001', orderDate: new Date('2021-07-01'), orderType: enumOrdType.SUBSCRIPTION, orderUnitAmount: 100, ordrStatus: 'Completed' }, dealingDate: new Date('2021-07-01'), settlementDate: new Date('2021-07-03') },
            { orderDetail: { referenceId: 'T00004', accountId: 'A0001', orderDate: new Date('2022-01-01'), orderType: enumOrdType.REDEMPTION, orderUnitAmount: 120, ordrStatus: 'Completed' }, dealingDate: new Date('2022-01-01'), settlementDate: new Date('2022-01-03') },
        ];

        const referenceDate = new Date('2023-07-08'); // The date to calculate holding periods
        const fifoHoldingPeriodCalculator = new FIFOHoldingPeriodCalculator(transactions);
        const holdingPeriods = fifoHoldingPeriodCalculator.calculateHoldingPeriods(referenceDate, 40);

        this.logger.info(`Holding periods:${JSON.stringify(holdingPeriods)}`);

        const dscSchedule: DSCSchedule = [
            { year: 1, percentage: 0.05 },
            { year: 2, percentage: 0.04 },
            { year: 3, percentage: 0.03 },
            { year: 4, percentage: 0.01 },
        ];

        const dscCalculator = new DSCCalculator(dscSchedule);

        const dscTransactions = dscCalculator.calculateDSC(holdingPeriods);
        this.logger.info(`The Deferred Sales Charge: ${JSON.stringify(dscTransactions)})`);

        this.logger.info('process.end');
    }
}

const container = new Container();

const main = container.resolve(app);
main.run();
