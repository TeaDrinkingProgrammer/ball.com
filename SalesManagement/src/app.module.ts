import { Module } from '@nestjs/common';
import { AppController } from './order.controller';
import { OrderService } from './order.service';
import { ClientsModule, Transport } from '@nestjs/microservices';


function hostname(): string {
  let host = process.env.host || 'rabbitmq';
  return `amqp://guest:guest@${host}:5672`;
}

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SERVICE', transport: Transport.RMQ,
        options: {
          urls: [hostname()],
          queue: 'user-messages',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [OrderService],
})
export class AppModule {}
