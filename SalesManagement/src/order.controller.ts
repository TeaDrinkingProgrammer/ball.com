import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderPayload, Status } from './models/order';
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

  @Put('/:orderId')
  updateOrderStatus(@Param('orderId') orderId: string, @Body() body: any) {
    if ((<any>Object).values(Status).includes(body.status)) {
      return this.orderService.updateOrderStatus(orderId, body.status);
  } else {
      return { message: 'Invalid status', status: 400 };
  }

  }
}
