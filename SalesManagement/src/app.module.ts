import { Module } from '@nestjs/common';
import { AppController } from './order.controller';
import { OrderService } from './order.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './models/order';
import { ProductController } from './product.controller';
import { mongodb, rabbitmq } from './connection';
import { Product, ProductSchema } from './models/product';

@Module({
  imports: [
    MongooseModule.forRoot(mongodb),
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    ClientsModule.register([
      {
        name: 'SERVICE', transport: Transport.RMQ,
        options: rabbitmq,
      },
    ]),
  ],
  controllers: [ProductController, AppController],
  providers: [OrderService, ProductController],
})
export class AppModule { }
