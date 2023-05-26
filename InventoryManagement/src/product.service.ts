import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
<<<<<<< HEAD
import { ProductDeleted, ProductMetaData, ProductMetadataPayload, ProductQuantity, ProductQuantityPayload } from './models/product';
import { jsonEvent } from '@eventstore/db-client';
=======
import { ProductDeleted, ProductCategory, ProductCategoryPayload, ProductQuantity, ProductQuantityPayload, ProductCreated, ProductCreatedPayload } from './models/product';
import { JSONEventType, jsonEvent } from '@eventstore/db-client';
>>>>>>> feature/inventorymanagement
import { client as eventStore } from './event-store';

@Injectable()
export class ProductService {
  constructor() { }

<<<<<<< HEAD
  async createProduct(ProductPayload: ProductQuantityPayload): Promise<any> {
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

  async updateProduct(ProductId: string, ProductPayload: ProductMetadataPayload): Promise<any> {
    const product = new ProductMetaData(ProductId, ProductPayload);
=======
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
>>>>>>> feature/inventorymanagement
    const addedEvent = jsonEvent({
      type: 'ProductMetaDataChanged',
      data: {
        ...product
      },
    });
    await eventStore.appendToStream(addedEvent.type, [addedEvent]);

    Logger.log('Product updated');

<<<<<<< HEAD
    return { message: 'Product metadata updated', status: 200 };
  }

  async deleteProduct(ProductId: string): Promise<any> {
=======
    return addedEvent;
  }

async deleteProduct(ProductId: string): Promise<{
  type: string,
  data: ProductDeleted
}> {
>>>>>>> feature/inventorymanagement
    const product = new ProductDeleted(ProductId);
    const addedEvent = jsonEvent({
      type: 'ProductDeleted',
      data: {
        ...product
      },
    });
    await eventStore.appendToStream(addedEvent.type, [addedEvent]);

    Logger.log('Product deleted');
    
<<<<<<< HEAD
    return { message: 'Product deleted', status: 200 };
=======
    return addedEvent;
>>>>>>> feature/inventorymanagement
  }

}
