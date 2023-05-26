import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ProductService } from './product.service';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) { }


  @EventPattern('ProductCreated')
  async handleProductCreated(data: Record<string, unknown>) {
    // let json = JSON.stringify(data);
    // this.productService.createProduct(JSON.parse(json));
    console.log('created ', data);
  }

  @EventPattern('ProductQuantityChanged')
  async handleProductQuantityChanged(data: Record<string, unknown>) {
    console.log('quantity ', data);

    // let json = JSON.stringify(data);
    // this.productService.handleProduct(JSON.parse(json));
  }


  @EventPattern('ProductCategoryChanged')
  async handleProductCategoryChanged(data: Record<string, unknown>) {
    console.log('category ', data);

    // let json = JSON.stringify(data);
    // this.productService.handleProduct(JSON.parse(json));
  }
}
