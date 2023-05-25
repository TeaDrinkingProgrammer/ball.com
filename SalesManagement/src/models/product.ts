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
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  manufacturer: string;

  constructor(data: any) {
    this.productId = data._id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.quantity = data.quantity;
    this.category = data.category;
    this.manufacturer = data.manufacturer;
  }
}

export const ProductSchema = SchemaFactory.createForClass(Product);
