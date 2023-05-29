import { IsNumber, IsPositive, IsString, IsUUID } from "class-validator";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export class ProductStockPayload {
  @IsString()
  @IsUUID()
  id: string;
  @IsNumber()
  quantity: number;
}

export class ProductStock {
  id: string;
  quantity: number;

  constructor(payload: ProductStockPayload) {
    this.id = payload.id;
    this.quantity = payload.quantity;
  }
}

export class ProductInfoPayload {
  @IsString()
  @IsUUID()
  id: string;
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsNumber()
  @IsPositive()
  price: number;
  @IsString()
  category: string;
  @IsString()
  manufacturer: string;
}
  
export class ProductInfo {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  manufacturer: string;

  constructor(payload: ProductInfoPayload) {
    this.id = payload.id;
    this.name = payload.name;
    this.description = payload.description;
    this.price = payload.price;
    this.category = payload.category;
    this.manufacturer = payload.manufacturer;
  }
}

export class ProductDeletedPayload {
  @IsString()
  @IsUUID()
  id: string;
}

export class ProductDeleted {
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

export class ProductPayload {
  @IsString()
  @IsUUID()
  id: string;
  @IsNumber()
  quantity: number;
  @IsString()
  supplier: string;
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsNumber()
  @IsPositive()
  price: number;
  @IsString()
  category: string;
  @IsString()
  manufacturer: string;
}

@Schema()
export class Product {
  @Prop({ unique: true, index: true })
  id: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  supplier: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: string;
  
  @Prop({ required: true })
  manufacturer: string;

  constructor(payload: ProductPayload) {
    this.id = payload.id;
    this.quantity = payload.quantity;
    this.supplier = payload.supplier;
    this.name = payload.name;
    this.description = payload.description;
    this.price = payload.price;
    this.category = payload.category;
    this.manufacturer = payload.manufacturer;
  }
}

export type ProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);