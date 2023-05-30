import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './models/order';
import { OrderController } from './order.controller';
import { mongoUrl } from './connection';
import { Product, ProductSchema } from './models/product';
import { OrderService } from './order.service';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Customer, CustomerSchema } from './models/customer';
import { Invoice, InvoiceSchema } from './models/invoice';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';

@Module({
  imports: [
    MongooseModule.forRoot(mongoUrl),
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Customer.name, schema: CustomerSchema },
    ])
  ],
  controllers: [OrderController, CustomerController, InvoiceController],
  providers: [OrderService, CustomerService, InvoiceService],
})
export class AppModule { }
