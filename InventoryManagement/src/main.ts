import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { rabbitmqUrl } from './connection';
import { client, connectToEventstoreDB } from './event-store';
import { FORWARDS, START, jsonEvent } from '@eventstore/db-client';
import { v4 as uuid } from 'uuid';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Connect to the event store
  await connectToEventstoreDB();
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
