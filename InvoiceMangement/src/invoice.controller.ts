import { Body, Controller, Get, Logger, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { InvoiceService } from './invoice.service';

@Controller("invoice")
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) { }

  // @Put('/:invoiceId')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // newOrder(@Body() orderPayload: OrderPayload) {
  //   return this.invoiceService.createOrder(orderPayload);
  // }

  @Get('/:invoiceId')
  getInvoice(@Param('invoiceId') invoiceId: string) {
    return this.invoiceService.getInvoice(invoiceId);
  }

  //   @Get('/:orderId')
  // getOrder(@Param('invoiceId') invoiceId: string) {
  //   return this.invoiceService.getOrder(invoiceId);
  // }

  @Get('')
  getOrders() {
    return this.invoiceService.getInvoices();
  }
}
