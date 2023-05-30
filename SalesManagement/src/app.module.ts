import { Module } from '@nestjs/common';
import { AppController } from './order.controller';
import { OrderService } from './order.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './models/order';
import { ProductController } from './product.controller';
import { mongoUrl, rabbitmqUrl } from './connection';
import { Product, ProductSchema } from './models/product';
import { ProductService } from './product.service';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';

@Module({
  imports: [
    MongooseModule.forRoot(mongoUrl),
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    ClientsModule.register([
      {
        name: 'SERVICE', transport: Transport.RMQ,
        options: {
          urls: [rabbitmqUrl],
          queue: 'order',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
  ],
  controllers: [ProductController, AppController, CustomerController],
  providers: [OrderService, ProductService, CustomerService],
})
export class AppModule { }
