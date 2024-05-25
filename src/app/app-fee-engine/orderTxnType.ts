import { OrderType } from "./orderType";
export class OrderTxnType {
    private orderDetail: OrderType;
    private dealingDate: Date;
    private settlementDate: Date;
    private units: number;
    private mv: number;

    constructor(orderDetail: OrderType, dealingDate: Date, settlementDate: Date, units: number, mv: number) {
        this.orderDetail = orderDetail;
        this.dealingDate = dealingDate;
        this.settlementDate = settlementDate;
        this.units = units;
        this.mv = mv;
    }
}
