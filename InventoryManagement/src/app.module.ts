import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './models/product';
import { AppController } from './product.controller';
import { mongodb, rabbitmq } from './connection';

@Module({
  imports: [
    MongooseModule.forRoot(mongodb),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    ClientsModule.register([
      {
        name: 'SERVICE', transport: Transport.RMQ,
        options: rabbitmq,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [ProductService],
})
export class AppModule {}
