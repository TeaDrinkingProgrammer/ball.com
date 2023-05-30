import { Injectable, Logger, } from '@nestjs/common';
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

    async deleteCustomer(data: any) {
        try {
            let result = await this.customerModel.deleteOne({ id: data.Id });
            if (result.deletedCount === 0) {
                Logger.log("Customer not found");
            }
        } catch (e) {
            Logger.log(e);
        }


    }
}
