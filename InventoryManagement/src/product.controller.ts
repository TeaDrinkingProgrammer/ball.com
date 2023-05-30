import { Body, Controller, Delete, Get, Inject, Logger, Param, Patch, Post, Put, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductInfo, ProductInfoPayload, Product, ProductPayload, ProductStockPayload as ProductStockPayload } from "./models/product";
import { ClientProxy, EventPattern } from "@nestjs/microservices";
import { BigintInterceptor } from "./bigint_interceptor";


@Controller('product')
@UseInterceptors(BigintInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService,
    @Inject('SERVICE') private readonly client: ClientProxy) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createProductREST(@Body() productPayload: ProductPayload) {
    Logger.log('Product created', productPayload);
    let id;
    try {
      const addedEvent = await this.productService.createProduct(productPayload);
      id = addedEvent.data.id;
      this.client.emit(addedEvent.type, addedEvent.data);
    } catch (error) {
      return { message: error, status: 400 };
    }
    
    return {message: "Product created",id: id, status: 201 };
  }
  @Get("/events")
  async getProductHistory() {
    let events;
    try {
      events = await this.productService.getProductHistory();
    } catch (error) {
      return { message: error, status: 400 };
    }
    
    return {message: "Events retrieved",events: events, status: 201 };
  }

  @Patch('stock')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateProductStockREST(@Body() productPayload: ProductStockPayload) {
    Logger.log('Product created', productPayload);
    let newStock;
    try {
      const addedEvent = await this.productService.updateProductStock(productPayload);
      newStock = addedEvent.data.quantity;

      this.client.emit(addedEvent.type, addedEvent.data);
    } catch (error) {
      return { message: error, status: 400 };
    }
    // { message: 'Product stock updated',stock: newStock, status: 201 }
    return { message: 'Product stock updated',stock: newStock, status: 201 };
  }

  @EventPattern('ProductStockChanged')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateProductStockEvent( @Body() productPayload: ProductStockPayload) {
    Logger.log('Product created', productPayload);
    try {
      await this.productService.updateProductStock(productPayload);
    } catch (error) {
      return { message: error, status: 400 };
    }
  }

  @Patch('info')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateProductInfoREST(@Body() productPayload: ProductInfoPayload) {
    try {
    Logger.log('Product category changed request', productPayload)
      const addedEvent = await this.productService.updateProductCategory(productPayload);
      this.client.emit(addedEvent.type, addedEvent.data);
    } catch (error) {
      return { message: error, status: 400 };
    }
    
    return { message: 'Product metadata updated', status: 201 };
  }

  @Delete(':productId')
  async DiscontinueProductCategoryREST(@Param('productId') productId: string) {
    try {
      const addedEvent = await this.productService.deleteProduct(productId);
      this.client.emit(addedEvent.type, addedEvent.data);
    } catch (error) {
      return { message: error, status: 400 };
    }
    
    return { message: 'Product deleted', status: 200 };
  }
}
