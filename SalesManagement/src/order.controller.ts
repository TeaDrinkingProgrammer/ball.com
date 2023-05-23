import { Body, Controller, Inject, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderPayload } from './event.order';
import { OrderService } from './order.service';

@Controller('order')
export class AppController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  newOrder(@Body() orderPayload: OrderPayload) {
    return this.orderService.createOrder(orderPayload);
  }

  @Post('cancel/:orderId')
  cancelOrder(@Param('orderId') orderId: string) {
    return this.orderService.cancelOrder(orderId);
  }
}
