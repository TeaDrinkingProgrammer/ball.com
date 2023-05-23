import { IsNumber, IsString } from "class-validator";
import { nanoid } from "nanoid";

export class Order {
    orderId: string;
    customerId: string;
    date: Date;
    status: string;
    totalAmount: number;
    paymentMethod: string;
    shippingAddress: string;

    constructor(payload: OrderPayload) {
        this.orderId = nanoid();
        this.customerId = payload.customerId;
        this.date = new Date();
        this.status = Status.made;
        this.totalAmount = payload.totalAmount;
        this.paymentMethod = payload.paymentMethod;
        this.shippingAddress = payload.shippingAddress;
    }

}

export class OrderPayload {
    @IsString()
    customerId: string;
    @IsNumber()
    totalAmount: number;
    @IsString()
    paymentMethod: string;
    @IsString()
    shippingAddress: string;
}

enum Status {
    made = "made",
    paid = "paid",
    shipped = "shipped",
    delivered = "delivered",
    cancelled = "cancelled"
}