import { Body, Controller, Delete, Inject, Logger, Param, Patch, Post, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductInfo, ProductInfoPayload, ProductCreated, ProductCreatedPayload, ProductStockPayload as ProductStockPayload } from "./models/product";
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
    return { message: 'Product stock updated', status: 201 };
  }

  @Patch('stock')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateProductStockREST(@Body() productPayload: ProductStockPayload) {
    Logger.log('Product created', productPayload);
    try {
      const addedEvent = await this.productService.updateProductStock(productPayload);
      this.client.emit(addedEvent.type, addedEvent.data);
    } catch (error) {
      return { message: error, status: 400 };
    }

    return { message: 'Product stock updated', status: 201 };
  }

  @EventPattern('ProductStockChanged')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateProductEvent( @Body() productPayload: ProductStockPayload) {
    Logger.log('Product created', productPayload);
    await this.productService.updateProductStock(productPayload);
  }

  @Patch('info')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateProductInfoREST(@Body() productPayload: ProductInfoPayload) {
    Logger.log('Product category changed request', productPayload)
    const addedEvent = await this.productService.updateProductCategory(productPayload);
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
