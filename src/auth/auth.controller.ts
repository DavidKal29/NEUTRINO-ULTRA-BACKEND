import { Body, Controller, Post, Res, Get, Param,Req } from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import type { Response, Request } from 'express';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { cookieOptions } from '../../src/cookieOptions/cookieOptions.js';
import { RecuperationEmailDTO } from './dto/recuperationEmail.dto';
import { ChangePasswordDTO } from './dto/changePassword.dto';

dotenv.config()

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('register')
    async register(@Body() dto:RegisterDTO, @Res() res:Response){
        const result = await  this.authService.register(dto)

        if (result.error) {
            return res.json(result)
        }

        const token = jwt.sign({userID:result.userID},process.env.JWT_SECRET)

        res.cookie('token',token,cookieOptions)

        return res.json(result)
    }


    @Post('login')
    async login(@Body() dto:LoginDTO, @Res() res:Response){
        const result = await  this.authService.login(dto)

        if (result.error) {
            return res.json(result)
        }

        const token = jwt.sign({userID:result.userID},process.env.JWT_SECRET)

        res.cookie('token',token,cookieOptions)

        return res.json(result)
        
    }

    @Get('logout')
    logout(@Res() res:Response){
        return this.authService.logout(res)
    }

    @Post('forgotPassword')
    forgotPassword(@Body() dto:RecuperationEmailDTO){
        return this.authService.forgotPassword(dto)
    }

    @Post('changePassword/:token')
    changePassword(@Body() dto:ChangePasswordDTO, @Param('token') token:string){
        return this.authService.changePassword(dto,token)
    }

    @Get('csrf-token')
    getCsrfToken(@Req() req:Request) {
        return { csrfToken: req.csrfToken() };
    }



}

