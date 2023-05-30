import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { ProductService } from './product.service';

@Controller()
export class CustomerController {
  constructor(private readonly productService: ProductService) { }


  // @EventPattern('CustomerAccountCreated')
  @MessagePattern('CustomerAccountCreated')
  async handleProductCreated(data: Record<string, unknown>) {
    Logger.log('product created');
    // let json = JSON.stringify(data);
    // this.productService.createProduct(JSON.parse(json));
  }

  @MessagePattern('CustomerInformationUpdated')
  async handleProductStockChanged(data: Record<string, unknown>) {
    console.log('stock ', data);
  }

  @MessagePattern('CustomerAccountDeleted')
  async handleProductCategoryChanged(data: Record<string, unknown>) {
    console.log('category ', data);
    // let json = JSON.stringify(data);
    // this.productService.updateInfo(JSON.parse(json));
  }

  @MessagePattern(undefined)
  async test(data: Record<string, unknown>) {
    console.log('test ', data);
  }
}
