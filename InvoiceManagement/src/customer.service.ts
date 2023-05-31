import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './models/customer';

@Injectable()
export class CustomerService {

    constructor(
        @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,) { }

    async createCustomer(data: any): Promise<any> {
        let customer = new Customer(data);
        await this.customerModel.create(customer);
    }
}
