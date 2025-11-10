import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

@Module({})
export class OrdersModule {
    controllers = [OrdersController]
    services = [OrdersService]
}
