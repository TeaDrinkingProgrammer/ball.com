import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNumber, IsPositive, IsString } from "class-validator";
import { HydratedDocument } from "mongoose";


export type ProductDocument = HydratedDocument<Product>;

export class ProductPayload {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsNumber()
  @IsPositive()
  price: number;
  @IsNumber()
  @IsPositive()
  quantity: number;
  @IsString()
  category: string;
  @IsString()
  manufacturer: string;
  @IsString()
  supplier: string;
}


@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  manufacturer: string;

  @Prop({ required: true })
  supplier: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  constructor(payload: ProductPayload) {
    this.name = payload.name;
    this.description = payload.description;
    this.price = payload.price;
    this.quantity = payload.quantity;
    this.category = payload.category;
    this.manufacturer = payload.manufacturer;
    this.supplier = payload.supplier;
  }

}

export const ProductSchema = SchemaFactory.createForClass(Product);
