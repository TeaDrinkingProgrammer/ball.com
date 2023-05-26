import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProductDeleted, ProductCategory, ProductCategoryPayload, ProductQuantity, ProductQuantityPayload, ProductCreated, ProductCreatedPayload } from './models/product';
import { JSONEventType, jsonEvent } from '@eventstore/db-client';
import { client as eventStore } from './event-store';

@Injectable()
export class ProductService {
  constructor() { }

  async createProduct(ProductPayload: ProductCreatedPayload): Promise<{
    type: string,
    data: ProductCreated
  }> {
    const productCreated = jsonEvent({
      type: 'ProductCreated',
      data: {
        ...new ProductCreated(ProductPayload)
      },
    });

    const productCategoryChanged = jsonEvent({
      type: 'ProductCategoryChanged',
      data: {
        ...new ProductCategory(ProductPayload.id, ProductPayload)
      },
    });

    const productQuantityChanged = jsonEvent({
      type: 'ProductQuantityChanged',
      data: {
        ...new ProductQuantity(ProductPayload)
      },
    });
  
    Logger.log("product created", productCreated.type, {...productCreated.data});

    await eventStore.appendToStream(productCategoryChanged.type, [productCategoryChanged]);
    await eventStore.appendToStream(productQuantityChanged.type, [productQuantityChanged]);

    return productCreated;
  }
  async updateProductQuantity(ProductPayload: ProductQuantityPayload): Promise<{
    type: string,
    data: ProductQuantity
  }> {
    const product = new ProductQuantity(ProductPayload);
    const addedEvent = jsonEvent({
      type: 'ProductQuantityChanged',
      data: {
        ...product
      },
    });
  
    Logger.log("product create", addedEvent.type, {...product});

    await eventStore.appendToStream(addedEvent.type, [addedEvent]);

    return addedEvent;
  }

  async updateProductCategory(ProductId: string, ProductPayload: ProductCategoryPayload): Promise<{
    type: string,
    data: ProductCategory
  }> {
    const product = new ProductCategory(ProductId, ProductPayload);
    const addedEvent = jsonEvent({
      type: 'ProductMetaDataChanged',
      data: {
        ...product
      },
    });
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
    await eventStore.appendToStream(addedEvent.type, [addedEvent]);

    Logger.log('Product deleted');
    
    return addedEvent;
  }

}
