import { Body, Controller, Delete, Inject, Logger, Param, Post, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductCategory, ProductCreated, ProductCreatedPayload, ProductQuantityPayload } from "./models/product";
import { ClientProxy, EventPattern } from "@nestjs/microservices";


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService,
    @Inject('SERVICE') private readonly client: ClientProxy) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createProductREST(@Body() productPayload: ProductCreatedPayload) {
    Logger.log('Product created', productPayload);
    const addedEvent = await this.productService.createProduct(productPayload);
    this.client.emit(addedEvent.type, addedEvent.data);
    return { message: 'Product quantity updated', status: 201 };
  }

  @Put(':productId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateProductREST(@Body() productPayload: ProductQuantityPayload) {
    Logger.log('Product created', productPayload);
    const addedEvent = await this.productService.updateProductQuantity(productPayload);
    this.client.emit(addedEvent.type, addedEvent.data);
    return { message: 'Product quantity updated', status: 201 };
  }

  @EventPattern('ProductQuantityChanged')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateProductEvent(@Body() productPayload: ProductQuantityPayload) {
    Logger.log('Product created', productPayload);
    await this.productService.updateProductQuantity(productPayload);
  }

  @Put(':productId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateProductCategoryREST(@Param('productId') productId: string, @Body() productPayload: ProductCategory) {
    const addedEvent = await this.productService.updateProductCategory(productId, productPayload);
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
