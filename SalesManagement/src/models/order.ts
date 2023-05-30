import { ArrayMinSize, IsArray, IsNumber, IsString, Max, Min, ValidateNested, ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Product, ProductDocument } from "./product";
import { Type } from "class-transformer";

export enum Status {
    made = "made",
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
    @Type(() => OrderProduct)
    @ValidateNested({ each: true })
    @IsArrayUnique('productId')
    products: OrderProduct[];
}

class OrderProduct {
    @IsString()
    productId: string;
    @IsNumber()
    @Max(20)
    @Min(1)
    quantity: number;
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
    paymentMethod: string;

    @Prop({ required: true })
    shippingAddress: string;

    @Prop()
    products:
        {
            product: Product,
            quantity: number
        }[]

    constructor(data: OrderPayload, products: { product: Product, quantity: number }[]) {
        this.customerId = data.customerId;
        this.paymentMethod = data.paymentMethod;
        this.shippingAddress = data.shippingAddress;
        this.products = products;
    }
}


export const OrderSchema = SchemaFactory.createForClass(Order);


function IsArrayUnique(property: string, validationOptions?: ValidationOptions): PropertyDecorator {
    return function (target: Object, propertyName: string | symbol): void {
        registerDecorator({
            name: 'isArrayUnique',
            target: target.constructor,
            propertyName: propertyName.toString(),
            options: validationOptions,
            validator: {
                validate(value: any): boolean {
                    if (!Array.isArray(value)) {
                        return false;
                    }
                    const uniqueValues = new Set();
                    for (const item of value) {
                        if (item && item[property]) {
                            const itemValue = item[property];
                            if (uniqueValues.has(itemValue)) {
                                return false;
                            }
                            uniqueValues.add(itemValue);
                        }
                    }
                    return true;
                },
                defaultMessage(args: ValidationArguments): string {
                    const property = args.property;
                    return `${property} array must have unique ${property} values`;
                },
            },
        });
    };
}