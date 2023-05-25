import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ProductService } from './product.service';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) { }


  @EventPattern('ProductCreated')
  async handleMessagePrinted(data: Record<string, unknown>) {
    let json = JSON.stringify(data);
    this.productService.createProduct(JSON.parse(json));
  }
}
