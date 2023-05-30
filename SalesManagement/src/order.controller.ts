import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderPayload } from './models/order';
import { OrderService } from './order.service';

@Controller('order')
export class AppController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  newOrder(@Body() orderPayload: OrderPayload) {
    return this.orderService.createOrder(orderPayload);
  }

  @Get('/:orderId')
  getOrder(@Param('orderId') orderId: string) {
    return this.orderService.getOrder(orderId);
  }

  @Get('')
  getOrders() {
    return this.orderService.getOrders();
  }
}
