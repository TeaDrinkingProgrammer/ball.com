import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ProductService } from './product.service';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) { }


  @EventPattern('ProductCreated')
  async handleProductCreated(data: Record<string, unknown>) {
    Logger.log('product created');
    let json = JSON.stringify(data);
    this.productService.createProduct(JSON.parse(json));
  }

  @EventPattern('ProductStockChanged')
  async handleProductStockChanged(data: Record<string, unknown>) {
    console.log('stock ', data);
    let json = JSON.stringify(data);
    this.productService.updateStock(JSON.parse(json));
  }


  @EventPattern('ProductInfoChanged')
  async handleProductCategoryChanged(data: Record<string, unknown>) {
    console.log('category ', data);
    let json = JSON.stringify(data);
    this.productService.updateInfo(JSON.parse(json));
  }
}
