import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductController } from './product-rest.controller';
import {mongoUrl, rabbitmqUrl } from './connection';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './models/product';

@Module({
  imports: [
    MongooseModule.forRoot(mongoUrl),
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
    ]),
    ClientsModule.register([
      {
        name: 'SERVICE', transport: Transport.RMQ,
        options: {
          urls: [rabbitmqUrl],
          queue: 'sales',
          queueOptions: {
            durable: true,
            exclusive: false,
            autoDelete: false
          },
        },
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class AppModule {}
