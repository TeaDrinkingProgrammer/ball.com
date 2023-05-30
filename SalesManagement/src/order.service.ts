import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Order, OrderPayload } from './models/order';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './models/product';

@Injectable()
export class OrderService {

  constructor(@Inject('SERVICE') private readonly client: ClientProxy,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>) { }

  async createOrder(orderPayload: OrderPayload): Promise<any> {
    let totalQuantity = orderPayload.products.reduce((acc, product) => acc + product.quantity, 0);
    if (totalQuantity > 20) {
      return { message: 'Quantity limit exceeded', status: 400 };
    }
    let productIds = orderPayload.products.map(product => product.productId);
    console.log(productIds);
    let products: Product[] = await this.productModel.find({ productId: { $in: productIds } })
      .lean()
      .select('-__v')
      .select('-_id')
      .exec();

    if (products.length !== productIds.length) {
      return { message: 'Product not found', status: 404 };
    }

    let productList: {product: Product, quantity: number}[] = [];
    for (let product of products) {
        let quantity = orderPayload.products.find(p => p.productId === product.productId).quantity;
        productList.push({product, quantity});
    }


    let order = new Order(orderPayload, productList);
    const createdOrder = await this.orderModel.create(order);
    this.client.emit('OrderPlaced', createdOrder);
    return { message: 'Order placed', id: createdOrder.id, status: 201 }
  }

  async getOrder(orderId: string): Promise<any> {
    Logger.log(orderId);
    let order;
    try {
      order = await this.orderModel.findById(orderId).select('-__v');
    } catch (e) {
      return { message: 'Order not found', status: 404 };
    }
    return { message: 'Order found', data: order, status: 200 };
  }

  async getOrders(): Promise<any> {
    const orders = await this.orderModel.find().select('-__v');
    return { data: orders, status: 200 };
  }
}
