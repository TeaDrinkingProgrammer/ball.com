import { ArrayMinSize, IsArray, IsNumber, IsString } from "class-validator";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

enum Status {
    made = "made",
    paid = "paid",
    shipped = "shipped",
    delivered = "delivered",
    cancelled = "cancelled"
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
    @IsArray()
    @ArrayMinSize(1)
    products: string[];
}

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
    @Prop({ required: true })
    customerId: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;

    @Prop({ default: Status.made, enum: Status })
    status: string;

    @Prop({ required: true })
    totalAmount: number;

    @Prop({ required: true })
    paymentMethod: string;

    @Prop({ required: true })
    shippingAddress: string;

    @Prop([{ type: String, ref: 'Product' }])
    products: any[];

    constructor(payload: OrderPayload) {
        this.customerId = payload.customerId;
        this.status = Status.made;
        this.totalAmount = payload.totalAmount;
        this.paymentMethod = payload.paymentMethod;
        this.shippingAddress = payload.shippingAddress;
        this.products = payload.products;
    }

}


export const OrderSchema = SchemaFactory.createForClass(Order);