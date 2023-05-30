import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Order } from "./order";
import { Customer } from "./customer";

export type InvoiceDocument = HydratedDocument<Invoice>;

enum PayementStatus {
    paid = "paid",
    pending = "pending",
    cancelled = "cancelled"
}

@Schema()
export class Invoice {

  @Prop({ required: true })
  order: Order;
    @Prop({ required: true })
  amount: number;
    @Prop({ required: true, enum: PayementStatus })
  payementStatus: string;
    @Prop({ required: true })
  customer: Customer;
    @Prop({ default: Date.now })
  createdAt: Date;
    @Prop({ default: Date.now })
  updatedAt : Date;

  constructor(order: Order, customer: Customer) {
    this.order = order;
    this.amount = calculateAmount(order);
    this.payementStatus = PayementStatus.pending;
    this.customer = customer;
  }
}

function calculateAmount(order: Order): number {
    let amount = 0;
    order.products.forEach(product => {
        amount += product.product.price * product.quantity;
    });
    return amount;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);