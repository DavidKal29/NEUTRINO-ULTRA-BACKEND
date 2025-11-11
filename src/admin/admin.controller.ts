import { Controller, Get, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import type {Request} from 'express'

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
}
