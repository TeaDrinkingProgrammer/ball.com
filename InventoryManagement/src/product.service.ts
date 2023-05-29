import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProductDeleted, ProductInfo, ProductInfoPayload, ProductStock, ProductStockPayload, Product, ProductPayload } from './models/product';
import { EventStoreDBClient, FORWARDS, JSONEventType, START, eventTypeFilter, excludeSystemEvents, jsonEvent, streamNameFilter } from '@eventstore/db-client';
import { client as eventStore } from './event-store';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<Product>) { }

  async createProduct(ProductPayload: ProductPayload): Promise<{
    type: string,
    data: Product
  }> {
    Logger.log("product created payload:", {...ProductPayload});
    Logger.log("product created class:", {...new Product(ProductPayload)});

    const product = new Product(ProductPayload);
    const productCreated = jsonEvent({
      type: 'ProductCreated',
      data: {
        ...product
      },
    });

    const productCategoryChanged = jsonEvent({
      type: 'ProductCategoryChanged',
      data: {
        ...new ProductInfo(ProductPayload)
      },
    });

    const productStockChanged = jsonEvent({
      type: 'ProductStockChanged',
      data: {
        ...new ProductStock(ProductPayload)
      },
    });

    if (! await productExists(this.productModel, product.id)) {
      Logger.error("Product already exists. updating instead");
      return Promise.reject({status: 409, message: "Product already exists."})
    }

    await this.productModel.create(product);

    Logger.log("product created", productCreated.type, {...productCreated.data});
  
    await eventStore.appendToStream(productCategoryChanged.type, [productCategoryChanged]);
    await eventStore.appendToStream(productStockChanged.type, [productStockChanged]);

    return productCreated;
  }

  async updateProductStock(ProductPayload: ProductStockPayload): Promise<{
    type: string,
    data: ProductStock
  }> {
    const product = new ProductStock(ProductPayload);
    const addedEvent = jsonEvent({
      type: 'ProductStockChanged',
      data: {
        ...product
      },
    });

    const productModel = this.productModel.findOne({ productId: product.id });

    if (! productModel) {
      Logger.error("Product already exists. updating instead");
      return Promise.reject({status: 404, message: "Cannot update product stock when product does not exist"})
    }
    
    await productModel.updateOne({ productId: product.id }, { quantity: product.quantity });

    await eventStore.appendToStream(addedEvent.type, [addedEvent]);

    return addedEvent;
  }

  async updateProductCategory(ProductPayload: ProductInfoPayload): Promise<{
    type: string,
    data: ProductInfo
  }> {
    const product = new ProductInfo(ProductPayload);
    const addedEvent = jsonEvent({
      type: 'ProductInfoChanged',
      data: {
        ...product
      },
    });

    if (! await productExists(this.productModel, product.id)) {
      Logger.error("Cannot update product category when product does not exist");
      return Promise.reject({status: 404, message: "Cannot update product category when product does not exist"})
    }

    await eventStore.appendToStream(addedEvent.type, [addedEvent]);

    Logger.log('Product updated');

    return addedEvent;
  }

async deleteProduct(ProductId: string): Promise<{
  type: string,
  data: ProductDeleted
}> {
    const product = new ProductDeleted(ProductId);
    const addedEvent = jsonEvent({
      type: 'ProductDeleted',
      data: {
        ...product
      },
    });

    if (! await productExists(this.productModel, product.id)) {
      Logger.error("Cannot delete product category when product does not exist");
      return Promise.reject({status: 404, message: "Cannot delete product category when product does not exist"})
    }

    await eventStore.appendToStream(addedEvent.type, [addedEvent]);

    Logger.log('Product deleted');
    
    return addedEvent;
  }

}


async function productExists(productModel: Model<Product>, productId: string) {
  if (await productModel.findOne({ productId: productId})) {
    Logger.error("Product does not exist.");
    return true;
  }
  return false;
}