import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CustomerService } from './customer.service';

@Controller()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }


  @MessagePattern('CustomerAccountCreated')
  async handleProductCreated(data: Record<string, unknown>) {
    Logger.log('customer created', data);
    this.customerService.createCustomer(data);
  }

  @MessagePattern('CustomerInformationUpdated')
  async handleProductStockChanged(data: Record<string, unknown>) {
    console.log('customer information update ', data);
  }

  @MessagePattern('CustomerAccountDeleted')
  async deleteCustomer(data: Record<string, unknown>) {
    console.log('delete customer', data);
    this.customerService.deleteCustomer(data);
  }

}
