import { Module } from '@nestjs/common';
import { AppController } from './order.controller';
import { OrderService } from './order.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './models/order';
import { ProductController } from './product.controller';
import { mongodb, rabbitmq } from './connection';

@Module({
  imports: [
    MongooseModule.forRoot(mongodb),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ClientsModule.register([
      {
        name: 'SERVICE', transport: Transport.RMQ,
        options: rabbitmq,
      },
    ]),
  ],
  // controllers: [AppController, ProductController],
  controllers: [ProductController, AppController],
  providers: [OrderService],
})
export class AppModule { }
