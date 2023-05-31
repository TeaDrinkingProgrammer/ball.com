import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {

    constructor(
        @Inject('INVENTORYQUEUE') private readonly inventoryClient: ClientProxy,
        @Inject("INVOICEQUEUE") private readonly invoiceClient: ClientProxy) { }

    emit(message: string, data: any) {
        this.inventoryClient.emit(message, data);
        this.invoiceClient.emit(message, data);
    }
}
