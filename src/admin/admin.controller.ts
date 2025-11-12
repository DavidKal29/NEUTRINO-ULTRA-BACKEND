import { Controller, Get, Param, Post, Req, Res, Body } from '@nestjs/common';
import { OrderDTO } from 'src/orders/dto/order.dto';
import { AdminService } from './admin.service';
import type {Request, Response} from 'express'

@Controller('admin')
export class AdminController {
    constructor (private readonly adminService:AdminService){}


    @Get('profile')
    profile(@Req() req:Request){
        const result = this.adminService.profile()

        if (result.success) {
            return {success:'Usuario logueado',user:req.user}
        }
    }

    @Get('getAllOrders')
    getAllOrders(){
        return this.adminService.getAllOrders()
    }

    @Get('changeOrderStatus/:id_order/:new_status')
    changeOrderStatus(@Param('id_order') id_order:string, @Param('new_status') new_status:string){
        return this.adminService.changeOrderStatus(id_order,new_status)
    }

    @Post('getPDFOrdersResume')
    getPDFOrdersResume(@Res() res:Response, @Body() dto:OrderDTO[]){
        return this.adminService.getPDFOrdersResume(res,dto)
    }
}
