import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductController } from './product.controller';
import {rabbitmqUrl } from './connection';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SERVICE', transport: Transport.RMQ,
        options: {
          urls: [rabbitmqUrl],
          queue: 'product',
          queueOptions: {
              durable: false
          },
        },
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class AppModule {}
