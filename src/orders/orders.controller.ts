import { Controller, Post, Req, Body, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import type { Request } from 'express';
import { CreateOrderDTO } from './dto/createOrder.dto';

@Controller('orders')
export class OrdersController {
    constructor (private readonly ordersService:OrdersService){}

    @Post('createOrder')
    createOrder(@Req() req:Request, @Body() dto:CreateOrderDTO){
        return this.ordersService.createOrder(req,dto)
    }

    @Get('getMyOrders')
    getMyOrders(@Req() req:Request){
        return this.ordersService.getMyOrders(req)
    }
}
