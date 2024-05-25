import {enumOrderStatus, enumOrdType} from "./enumFeeEngine";

export class OrderType {
    referenceId: string;
    accountId: string;
    orderDate: Date;
    orderType: enumOrdType;
    orderUnitAmount: number;
    ordrStatus: enumOrderStatus;

    constructor(referenceId: string, accountId: string, orderDate: Date, orderType: enumOrdType, orderUnitAmount: number, ordrStatus: enumOrderStatus) {
        this.referenceId = referenceId;
        this.accountId = accountId;
        this.orderDate = orderDate;
        this.orderType = orderType;
        this.orderUnitAmount = orderUnitAmount;
        this.ordrStatus = ordrStatus;
    }
}
