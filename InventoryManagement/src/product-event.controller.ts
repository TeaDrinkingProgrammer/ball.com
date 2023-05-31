import { Controller, Logger } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { ProductService } from "./product.service";
import { ProductStockPayload } from "./models/product";

@Controller('product')
export class ProductEventController {
    constructor(private readonly productService: ProductService) { }
    @EventPattern('OrderPlaced')
    async updateProductStockEvent(data: Record<string, unknown>) {
      Logger.log('Order placed', data);
      
      const jsonObject = JSON.parse(JSON.stringify(data));
      
      for (const product of jsonObject.products) {
        const productStockPayload: ProductStockPayload = {
          id: product.product.productId,
          quantity: product.quantity
        }
        
        try {
          await this.productService.orderPlaced(productStockPayload);
        } catch (error) {
          return { message: error, status: 400 };
        }
        
      }
    }
}