import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class ProductController {
  constructor() { }


  @EventPattern('ProductCreated')
  async handleMessagePrinted(data: Record<string, unknown>) {
    Logger.log('Product created', data);
  }
}
