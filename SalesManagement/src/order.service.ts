import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Order, OrderPayload } from './models/order';

@Injectable()
export class OrderService {

  constructor(@Inject('SERVICE') private readonly client: ClientProxy) {}

  async createOrder(orderPayload: OrderPayload): Promise<any> {
    return this.client.emit('OrderPlaced', new Order(orderPayload));
  }

  async cancelOrder(orderId: string): Promise<any> {
    return this.client.emit('OrderCancelled', orderId);
  }

  async getOrder(orderId: string): Promise<any> {
    //TODO implement
    return this.client.emit('OrderCancelled', orderId);
  }
}
