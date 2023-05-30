import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProductDeleted, ProductInfo, ProductInfoPayload, ProductStock, ProductStockPayload, ProductCreated, ProductCreatedPayload } from './models/product';
import { EventStoreDBClient, FORWARDS, JSONEventType, START, eventTypeFilter, excludeSystemEvents, jsonEvent, streamNameFilter } from '@eventstore/db-client';
import { client as eventStore } from './event-store';

@Injectable()
export class ProductService {
  constructor() { }

  async createProduct(ProductPayload: ProductCreatedPayload): Promise<{
    type: string,
    data: ProductCreated
  }> {
    Logger.log("product created payload:", {...ProductPayload});
    Logger.log("product created class:", {...new ProductCreated(ProductPayload)});

    const productCreated = jsonEvent({
      type: 'ProductCreated',
      data: {
        ...new ProductCreated(ProductPayload)
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
    type ProductInfoUpdatedEvent = JSONEventType<"ProductInfoChanged", {
      id: string;
    }>
    // Handle error when eventstream does not exist
    const events = eventStore.readStream<ProductInfoUpdatedEvent>("ProductStockChanged", {
      fromRevision: START,
      direction: FORWARDS,
    });

    for await (const { event } of events) {
      if (event.data.id === product.id) {
        Logger.log("product create", addedEvent.type, {...product});

        await eventStore.appendToStream(addedEvent.type, [addedEvent]);
        
        return addedEvent;
      }
    }

    return Promise.reject("Cannot add product stock when product does not exist");
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
