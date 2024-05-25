import { OrderTxnType } from './orderTxnType';
import {OrderType} from "./orderType";

export class CalculatedFeeTransaction {
    orderTxnDetail: OrderTxnType;
    holdingPeriod: number;
    soldUnits: number;
    deductedUnits: number;

    constructor(orderDetail: OrderTxnType, holdingPeriod: number, soldUnits: number, deductedUnits: number) {
        this.orderTxnDetail = orderDetail;
        this.holdingPeriod = holdingPeriod;
        this.soldUnits = soldUnits;
        this.deductedUnits = deductedUnits;
    }
}
