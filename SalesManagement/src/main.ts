import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { rabbitmq } from './connection';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ, options: {
      urls: [rabbitmq],
      queue: 'product',
      queueOptions: {
        durable: false
      },
    }
  });
  await app.startAllMicroservices();
  await app.listen(3002);
}
bootstrap();
