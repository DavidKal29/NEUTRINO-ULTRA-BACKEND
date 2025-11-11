import { Controller, Post, Req, Body, Get, Param, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import type { Request,Response } from 'express';
import { CreateOrderDTO } from './dto/createOrder.dto';
import { OrderDTO } from './dto/order.dto';

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

    @Get('getOrder/:id_order')
    getOrder(@Req() req:Request, @Param('id_order') id_order:string){
        return this.ordersService.getOrder(req,id_order)
    }

    @Get('deleteOrder/:id_order')
    deleteOrder(@Req() req:Request, @Param('id_order') id_order:string){
        return this.ordersService.deleteOrder(req,id_order)
    }

    @Post('getPDFOrder')
    getPDFOrder(@Res() res:Response, @Body() dto:OrderDTO){
        return this.ordersService.getPDFOrder(res,dto)
    }
}
