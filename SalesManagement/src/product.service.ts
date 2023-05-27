import { Injectable, Logger, } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './models/product';

@Injectable()
export class ProductService {

    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<Product>,) { }

    async createProduct(data: any): Promise<any> {
        let product = new Product(data);
        await this.productModel.create(product);
    }

    async updateProduct({ data }: any) {
        let product = new Product(data);
        Logger.log(product);
        let result = await this.productModel.findOneAndUpdate({ productId: product.productId }, product);
        if (!result) {
            Logger.log("Product not found");
        } else {
            Logger.log("Product updated");
        }
    }

    async updateQuantity(data: any) {
        let result = await this.productModel.findOneAndUpdate({ productId: data.id }, { quantity: data.quantity });
        if (!result) {
            Logger.log("Product not found");
        } else {
            Logger.log("Product quantity updated");
        }
    }

    async updateInfo(data: any) {
        let productId = data.id;
        delete data.id;
        let product = {
            productId,
            ...data
        }
        console.log(product);
        let result = await this.productModel.findOneAndUpdate({ productId: product.productId }, { quantity: product.quantity });
        if (!result) {
            Logger.log("Product not found");
        } else {
            Logger.log("Product info updated");
        }
    }
}
