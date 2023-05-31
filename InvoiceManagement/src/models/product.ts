import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({ unique: true, index: true })
  productId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  manufacturer: string;

  constructor(data: any) {
    this.productId = data.id;
    this.name = data.name;
    this.price = data.price;
    this.manufacturer = data.manufacturer;
  }
}

export const ProductSchema = SchemaFactory.createForClass(Product);
