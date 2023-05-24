import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Order, OrderPayload } from './models/order';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrderService {

  constructor(@Inject('SERVICE') private readonly client: ClientProxy,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,) { }

  async createOrder(orderPayload: OrderPayload): Promise<any> {
    const newOrder = new Order(orderPayload);
    const createdOrder = await this.orderModel.create(newOrder);
    this.client.emit('OrderPlaced', createdOrder);
    return { message: 'Order placed', status: 201 }
  }

  async cancelOrder(orderId: string): Promise<any> {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      return { message: 'Order not found', status: 404 };
    }

    order.status = 'cancelled';
    await order.save();

    this.client.emit('OrderCancelled', orderId);
    return { message: 'Order cancelled', status: 200 };
  }
}
