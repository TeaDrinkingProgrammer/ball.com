import { Injectable, Logger, } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './models/product';
import { Invoice } from './models/invoice';
import { Order } from './models/order';
import { Customer } from './models/customer';

@Injectable()
export class InvoiceService {

  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
  ) { }

  async getInvoice(invoiceId: string): Promise<any> {
    Logger.log(invoiceId);
    let invoice;
    try {
      invoice = await this.orderModel.findById(invoiceId).select('-__v');
    } catch (e) {
      return { message: 'Invoice not found', status: 404 };
    }
    return { message: 'Invoice found', data: invoice, status: 200 };
  }

  async getInvoices(): Promise<any> {
    const invoices = await this.invoiceModel.find().select('-__v');
    return { data: invoices, status: 200 };
  }
}
