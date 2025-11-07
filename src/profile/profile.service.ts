import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileService {
    profile(){
        return {success:'Entraste a perfil'}
    }
}
