import { Logger } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { ProductService } from "./product.service";
import { ProductStockPayload } from "./models/product";

export class ProductEventController {
    constructor(private readonly productService: ProductService) { }
    @EventPattern('ProductStockChanged')
    async updateProductStockEvent(data: Record<string, unknown>) {
      Logger.log('Product created', data);
      const jsonObject = JSON.parse(JSON.stringify(data));
      try {
        await this.productService.updateProductStock(jsonObject as ProductStockPayload);
      } catch (error) {
        return { message: error, status: 400 };
      }
    }
}