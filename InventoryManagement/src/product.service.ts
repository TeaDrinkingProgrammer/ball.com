import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProductDeleted, ProductMetaData, ProductMetadataPayload, ProductQuantity, ProductQuantityPayload } from './models/product';
import { jsonEvent } from '@eventstore/db-client';
import { client as eventStore } from './event-store';

@Injectable()
export class ProductService {
  constructor(@Inject('SERVICE') private readonly client: ClientProxy) { }

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
    
    this.client.emit(addedEvent.type, product);

    return { message: 'Product quantity updated', status: 201 }
  }

  async updateProduct(ProductId: string, ProductPayload: ProductMetadataPayload): Promise<any> {
    const product = new ProductMetaData(ProductId, ProductPayload);
    const addedEvent = jsonEvent({
      type: 'ProductMetaDataChanged',
      data: {
        ...product
      },
    });
    await eventStore.appendToStream(addedEvent.type, [addedEvent]);
    
    this.client.emit(addedEvent.type, addedEvent.data);

    Logger.log('Product updated');
    return { message: 'Product metadata updated', status: 200 };
  }

  async deleteProduct(ProductId: string): Promise<any> {
    const product = new ProductDeleted(ProductId);
    const addedEvent = jsonEvent({
      type: 'ProductDeleted',
      data: {
        ...product
      },
    });
    await eventStore.appendToStream(addedEvent.type, [addedEvent]);
    
    this.client.emit(addedEvent.type, addedEvent.data);

    Logger.log('Product deleted');
    return { message: 'Product deleted', status: 200 };
  }

}
