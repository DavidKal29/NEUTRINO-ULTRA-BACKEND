import { Controller,Get,Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import type { Request } from 'express';

@Controller('profile')
export class ProfileController {
    constructor (private readonly profileService: ProfileService){}


    @Get('profile')
    async profile(@Req() req:Request){
        const result  = this.profileService.profile()

        if (result.success) {
            return {success:'Usuario logueado',user:req.user}
        }
    }


}

