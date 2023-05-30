import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @EventPattern('OrderPlaced')
  async handleOrderCreated(data: Record<string, unknown>) {
    Logger.log('order placed', data);
    let json = JSON.stringify(data);
    await this.orderService.createOrder(JSON.parse(json));
  }
}
