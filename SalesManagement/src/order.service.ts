import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Order, OrderPayload } from './models/order';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './models/product';

@Injectable()
export class OrderService {

  constructor(@Inject('SERVICE') private readonly client: ClientProxy,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>) { }

  async createOrder(orderPayload: OrderPayload): Promise<any> {
    let productIds = orderPayload.products;
    let products: Product[] = await this.productModel.find({ productId: { $in: productIds } })
      .lean()
      .select('-__v')
      .select('-_id')
      .exec();
    if (products.length !== productIds.length) {
      return { message: 'Product not found', status: 404 };
    }
    let order = new Order(orderPayload, products);
    const createdOrder = await this.orderModel.create(order);
    this.client.emit('OrderPlaced', createdOrder);
    return { message: 'Order placed', id: createdOrder.id, status: 201 }
  }

  async cancelOrder(orderId: string): Promise<any> {
    const order = await this.orderModel.findById(orderId).populate('products');
    if (!order) {
      return { message: 'Order not found', status: 404 };
    }

    order.status = 'cancelled';
    await order.save();

    this.client.emit('OrderCancelled', orderId);
    return { message: 'Order cancelled', status: 200 };
  }

  async getOrder(orderId: string): Promise<any> {
    Logger.log(orderId);
    let order;
    try {
      order = await this.orderModel.findById(orderId).select('-__v');
    } catch (e) {
      return { message: 'Order not found', status: 404 };
    }
    return { message: 'Order found', data: order, status: 200 };
  }

  async getOrders(): Promise<any> {
    const orders = await this.orderModel.find().select('-__v');
    return { data: orders, status: 200 };
  }
}
