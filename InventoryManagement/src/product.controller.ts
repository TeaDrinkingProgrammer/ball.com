import { Body, Controller, Delete, Logger, Param, Post, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductMetaData, ProductQuantityPayload } from "./models/product";


@Controller('product')
export class AppController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  newOrder(@Body() productPayload: ProductQuantityPayload) {
    Logger.log('Product created', productPayload);
    return this.productService.createProduct(productPayload);
  }

  @Put(':productId')
  @UsePipes(new ValidationPipe({ transform: true }))
  updateProduct(@Param('productId') productId: string, @Body() productPayload: ProductMetaData) {
    return this.productService.updateProduct(productId, productPayload);
  }

  @Delete(':productId')
  deleteProduct(@Param('productId') productId: string) {
    return this.productService.deleteProduct(productId);
  }
}
