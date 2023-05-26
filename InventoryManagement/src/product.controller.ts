import { Body, Controller, Delete, Inject, Logger, Param, Post, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductMetaData, ProductQuantityPayload } from "./models/product";
import { ClientProxy, EventPattern } from "@nestjs/microservices";


@Controller('product')
export class AppController {
  constructor(private readonly productService: ProductService,
    @Inject('SERVICE') private readonly client: ClientProxy) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createProductREST(@Body() productPayload: ProductQuantityPayload) {
    Logger.log('Product created', productPayload);
    const addedEvent = await this.productService.createProduct(productPayload);
    this.client.emit(addedEvent.type, addedEvent.data);
    return { message: 'Product quantity updated', status: 201 };
  }

  @EventPattern('ProductQuantityChanged')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createProductEvent(@Body() productPayload: ProductQuantityPayload) {
    Logger.log('Product created', productPayload);
    await this.productService.createProduct(productPayload);
  }

  @Put(':productId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateProductCategoryREST(@Param('productId') productId: string, @Body() productPayload: ProductMetaData) {
    const addedEvent = await this.productService.updateProduct(productId, productPayload);
    this.client.emit(addedEvent.type, addedEvent.data);
    return { message: 'Product metadata updated', status: 201 };
  }

  @Delete(':productId')
  async DiscontinueProductCategoryREST(@Param('productId') productId: string) {
    const addedEvent = await this.productService.deleteProduct(productId);
    this.client.emit(addedEvent.type, addedEvent.data);
    return { message: 'Product deleted', status: 200 };
  }
}
