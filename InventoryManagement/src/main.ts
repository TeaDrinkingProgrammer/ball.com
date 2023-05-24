import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { rabbitmqUrl } from './connection';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Invoice service does not exist yet - just as an example.
  app.connectMicroservice<MicroserviceOptions>({transport: Transport.RMQ, options: {
    urls: [rabbitmqUrl],
    queue: 'invoice',
    queueOptions: {
        durable: false
    },
  }});
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
