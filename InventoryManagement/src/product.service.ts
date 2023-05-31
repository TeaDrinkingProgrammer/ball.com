import { Injectable, Logger } from '@nestjs/common';
import { ProductDeleted, ProductInfo, ProductInfoPayload, ProductStock, ProductStockPayload, Product, ProductPayload } from './models/product';
import { BACKWARDS, END, FORWARDS, START, jsonEvent } from '@eventstore/db-client';
import { client as eventStore } from './event-store';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<Product>) { }

  async createProduct(ProductPayload: ProductPayload): Promise<{
    type: string,
    data: Product
  }> {
    const uuid = uuidv4();

    const product = new Product(uuid, ProductPayload);
    const productCreated = jsonEvent({
      type: 'ProductCreated',
      data: {
        ...product
      },
    });

    const productCategoryChanged = jsonEvent({
      type: 'ProductCategoryChanged',
      data: {
        ...new ProductInfo({ id: uuid, ...ProductPayload })
      },
    });

    const productStockChanged = jsonEvent({
      type: 'ProductStockChanged',
      data: {
        ...new ProductStock({ id: uuid, ...ProductPayload })
      },
    });

    try {
      if (! await productExists(this.productModel, product.id)) {
        Logger.error("Product already exists. updating instead");
        return Promise.reject({ status: 409, message: "Product already exists." })
      }

      await this.productModel.create(product);

      await eventStore.appendToStream(productCategoryChanged.type, [productCategoryChanged]);
      await eventStore.appendToStream(productStockChanged.type, [productStockChanged]);

      Logger.log("Product created", productCreated.type, { ...productCreated.data });
      return productCreated;
    } catch (error) {

      Logger.error(error);
      return Promise.reject({ status: 500, message: "Internal Server Error" })
    }
  }

  async getProductHistory() {
    const events = eventStore.readAll({
      direction: BACKWARDS,
      fromPosition: END,
      maxCount: 1000
    });
    let returnedEvents = [];

    for await (const resolvedEvent of events) {
      //Skip system events
      if (resolvedEvent.event?.type.at(0) === "$") {
        continue;
      }
      returnedEvents.push(
        {
          id: resolvedEvent.event?.id,
          type: resolvedEvent.event?.type,
          data: resolvedEvent.event?.data,
          created: resolvedEvent.event?.created,
        }
        );
    }
    return returnedEvents
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

    const dbProduct = await this.productModel.findOne({ id: product.id });

    try {

      if (dbProduct === null) {
        Logger.error("Product does not exist. aborting update");
        return Promise.reject({ status: 404, message: "Cannot update product stock when product does not exist" })
      }
      const newQuantity = dbProduct.quantity + product.quantity

      //TODO: What if the stock goes below zero?
      if (newQuantity < 0) {
        return Promise.reject({ status: 404, message: "Stock cannot go below zero" })
      }

      await this.productModel.updateOne({ id: product.id }, { quantity: newQuantity });

      await eventStore.appendToStream(addedEvent.type, [addedEvent]);

      Logger.log('Product Stock updated');
      addedEvent.data.quantity = newQuantity;
      return addedEvent;

    } catch (error) {

      Logger.error(error);
      return Promise.reject({ status: 500, message: "Internal Server Error" })
    }
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

    try {

      if (! await productExists(this.productModel, product.id)) {
        Logger.error("Cannot update product category when product does not exist");
        return Promise.reject({ status: 404, message: "Cannot update product category when product does not exist" })
      }

      const { id: productId, ...productWithoutId } = product;
      await this.productModel.updateOne({ id: productId }, { ...productWithoutId });

      await eventStore.appendToStream(addedEvent.type, [addedEvent]);

      Logger.log('Product Category updated');
      return addedEvent;

    } catch (error) {

      Logger.error(error);
      return Promise.reject({ status: 500, message: "Internal Server Error" })
    }
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

    try {
      if (! await productExists(this.productModel, product.id)) {
        Logger.error("Cannot delete product category when product does not exist");
        return Promise.reject({ status: 404, message: "Cannot delete product category when product does not exist" })
      }

      await this.productModel.deleteOne({ id: product.id });

      await eventStore.appendToStream(addedEvent.type, [addedEvent]);

      Logger.log('Product deleted');

      return addedEvent;

    } catch (error) {
      Logger.error(error);
      return Promise.reject({ status: 500, message: "Internal Server Error" })
    }
  }

}


async function productExists(productModel: Model<Product>, productId: string) {
  if (await productModel.findOne({ id: productId }) === null) {
    Logger.debug("Product does not exist.");
    return true;
  }
  return false;
}