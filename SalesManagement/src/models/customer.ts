import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CustomerDocument = HydratedDocument<Customer>;

@Schema()
export class Customer {

  @Prop({ required: true })
  id: string;

  constructor(data: any) {
    this.id = data.Id;
  }
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);