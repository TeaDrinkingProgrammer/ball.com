import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Order, OrderPayload, Status } from './models/order';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './models/product';
import { Customer } from './models/customer';
import { RabbitMQService } from './rabbitmq.service';

@Injectable()
export class OrderService {

  constructor(private readonly client: RabbitMQService,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
  ) { }

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

    let customer = await this.customerModel.findOne({ id: orderPayload.customerId });
    if (!customer) {
      return { message: 'Customer not found', status: 404 };
    }

    let productList: { product: Product, quantity: number }[] = [];
    for (let product of products) {
      let quantity = orderPayload.products.find(p => p.productId === product.productId).quantity;
      if (product.stock < quantity) {
        return { message: `Product ${product.name} - ${product.productId} out of stock`, status: 400 };
      }
      productList.push({ product, quantity });
    }

    productList.forEach(async (product) => {
      await this.productModel.findOneAndUpdate({ productId: product.product.productId }, { stock: product.product.stock - product.quantity });
    });


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

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    let update = await this.orderModel.findByIdAndUpdate(orderId, { status: status });
    if (!update) {
      return { message: 'Order not found', status: 404 };
    } else {
      return { message: 'Order status updated', status: 200 };
    }
  }
}
