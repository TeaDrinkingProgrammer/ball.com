import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductPayload } from './models/product';

@Injectable()
export class ProductService {

  constructor(@Inject('SERVICE') private readonly client: ClientProxy,
    @InjectModel(Product.name) private readonly ProductModel: Model<Product>,) { }

  async createProduct(ProductPayload: ProductPayload): Promise<any> {
    const newProduct = new Product(ProductPayload);
    const createdProduct = await this.ProductModel.create(newProduct);
    this.client.emit<any>('ProductCreated', createdProduct);
    return { message: 'Product created', status: 201 }
  }

  async updateProduct(ProductId: string, ProductPayload: ProductPayload): Promise<any> {
    const updatedProduct = {
      ...ProductPayload,
      updatedAt: new Date(),
    };

    await this.ProductModel.updateOne({ _id: ProductId }, updatedProduct);
    this.client.emit('ProductUpdated', updatedProduct);
    return { message: 'Product updated', status: 200 };
  }

  async deleteProduct(ProductId: string): Promise<any> {
    await this.ProductModel.deleteOne({ _id: ProductId });
    this.client.emit('ProductDeleted', ProductId);
    return { message: 'Product deleted', status: 200 };
  }

}
