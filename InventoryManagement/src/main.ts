import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { rabbitmq } from './connection';


async function bootstrap() {
  const listener = await NestFactory.createMicroservice(AppModule, {
    name: 'SERVICE', transport: Transport.RMQ,
    options: rabbitmq,
  });
  const app = await NestFactory.create(AppModule);
  await app.listen(3001, async () => await listener.listen());
}
bootstrap();
