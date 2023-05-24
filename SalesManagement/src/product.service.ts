import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Order, OrderPayload } from './models/order';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './models/product';

@Injectable()
export class OrderService {

    constructor(
        @InjectModel(Product.name) private readonly product: Model<Product>,) { }

    async createOrder(orderPayload: OrderPayload): Promise<any> {
        const newOrder = new Order(orderPayload);
        const createdOrder = await this.product.create(newOrder);
        return { message: 'Order placed', status: 201 }
    }

    async cancelOrder(orderId: string): Promise<any> {
        const order = await this.product.findById(orderId);
        if (!order) {
            return { message: 'Order not found', status: 404 };
        }

        await order.save();
        return { message: 'Order cancelled', status: 200 };
    }
}
