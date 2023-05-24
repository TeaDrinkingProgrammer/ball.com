import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

enum Gender {
    male = "male",
    female = "female"
}
export type CustomerDocument = HydratedDocument<Customer>;

@Schema()
export class Customer {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true, enum: Gender })
  gender: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);