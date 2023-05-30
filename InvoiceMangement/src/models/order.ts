import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Product } from "./product";

enum Status {
    made = "made",
    paid = "paid",
    shipped = "shipped",
    delivered = "delivered",
    cancelled = "cancelled"
}

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {

    @Prop({ default: Status.made, enum: Status })
    status: string;

    @Prop({ required: true })
    totalAmount: number;

    @Prop({ required: true })
    paymentMethod: string;

    @Prop({ required: true })
    shippingAddress: string;

    @Prop()
    products:
        {
            product: Product,
            quantity: number
        }[]

    constructor(data: any) {
        this.totalAmount = data.totalAmount;
        this.paymentMethod = data.paymentMethod;
        this.shippingAddress = data.shippingAddress;
        this.products = data.products;
    }
}


export const OrderSchema = SchemaFactory.createForClass(Order);