import { Injectable, Logger, } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './models/product';
import { Order } from './models/order';
import { Customer } from './models/customer';
import { Invoice } from './models/invoice';

@Injectable()
export class OrderService {

    constructor(
        @InjectModel(Order.name) private readonly orderModel: Model<Order>,
        @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
        @InjectModel(Customer.name) private readonly customerModel: Model<Customer>) { }

    async createOrder(data: any): Promise<any> {
        let order = new Order(data);
        await this.orderModel.create(order);
        await this.buildInvoice(order, data.customerId);
    }

    async buildInvoice(order: Order, customerId: number) {
        let customer : Customer = await this.customerModel.findOne({id: customerId}).exec();
        let invoice = new Invoice(order, customer);
        await this.invoiceModel.create(invoice);
    }
}

