import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CustomerDocument = HydratedDocument<Customer>;

@Schema()
export class Customer {

  @Prop({ required: true })
  id: string;
    @Prop({ required: true })
  name: string;
    @Prop({ required: true })
  address: string;
    @Prop({ required: true })
  phone: string;
    @Prop({ required: true })
  email : string;

  constructor(data: any) {
    this.id = data.Id;
    this.name = data.Name;
    this.address = data.Address;
    this.phone = data.Phone;
    this.email = data.Email;
  }
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);