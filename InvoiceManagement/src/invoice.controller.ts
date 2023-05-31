import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { PayementStatus } from './models/invoice';

@Controller("invoice")
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) { }

  @Put('/:invioceId')
  updateOrderStatus(@Param('invioceId') invioceId: string, @Body() body: any) {
    if ((<any>Object).values(PayementStatus).includes(body.payementStatus)) {
        return this.invoiceService.updateInvoicePayementStatus(invioceId, body.payementStatus);
    } else {
        return { message: 'Invalid payementStatus', status: 400 };
    }
  }

  @Get('/:invoiceId')
  getInvoice(@Param('invoiceId') invoiceId: string) {
    return this.invoiceService.getInvoice(invoiceId);
  }

  @Get('')
  getOrders() {
    return this.invoiceService.getInvoices();
  }

}
