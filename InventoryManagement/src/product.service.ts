import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProductDeleted, ProductMetaData, ProductMetadataPayload, ProductQuantity, ProductQuantityPayload } from './models/product';
import { JSONEventType, jsonEvent } from '@eventstore/db-client';
import { client as eventStore } from './event-store';

@Injectable()
export class ProductService {
  constructor() { }

  async createProduct(ProductPayload: ProductQuantityPayload): Promise<{
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

  async updateProduct(ProductId: string, ProductPayload: ProductMetadataPayload): Promise<{
    type: string,
    data: ProductMetaData
  }> {
    const product = new ProductMetaData(ProductId, ProductPayload);
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
