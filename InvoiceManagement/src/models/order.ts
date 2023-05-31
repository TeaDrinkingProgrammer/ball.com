import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Product } from "./product";

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
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
        this.paymentMethod = data.paymentMethod;
        this.shippingAddress = data.shippingAddress;
        this.products = data.products;
    }
}


export const OrderSchema = SchemaFactory.createForClass(Order);