import { Injectable, Logger, } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './models/product';

@Injectable()
export class ProductService {

    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<Product>,) { }

    async createProduct({ data }: any): Promise<any> {
        Logger.log(data);
        let product = new Product(data);
        Logger.log(product);
        let obj = await this.productModel.create(product);
        Logger.log(obj);
    }

    async cancelOrder(orderId: string): Promise<any> {
        const order = await this.productModel.findById(orderId);
        if (!order) {
            return { message: 'Order not found', status: 404 };
        }

        await order.save();
        return { message: 'Order cancelled', status: 200 };
    }
}
