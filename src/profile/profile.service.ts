import { Injectable } from '@nestjs/common';
import {conectarDB} from '../../src/database/mongo'
import { EditProfileDTO } from './dto/editProfile.dto';
import { ObjectId } from 'mongodb';
import { Request } from 'express';

@Injectable()
export class ProfileService {
    profile(){
        return {success:'Entraste a perfil'}
    }

    async editProfile(req:Request,dto:EditProfileDTO){
        try {
            const db = await conectarDB()
            const users = db.collection('users')

            console.log('Entramos a la ruta');
            

            const userID = req.user?._id

            const user_exists = await users.findOne({_id:new ObjectId(userID)})

            console.log('User exists definido');
            

            if (user_exists) {

                console.log('Usuario existe');
                
                const results = await users.updateOne(
                    {_id:new ObjectId(userID)},
                    {$set:{
                        email:dto.email,
                        username:dto.username,
                        name:dto.name,
                        lastname:dto.lastname,
                        address:dto.address,
                        phone:dto.phone,
                        dni:dto.dni
                    }},
                    {upsert:true}
                )

                if (results.modifiedCount === 0) {
                    console.log('Asegurate de que al menos unccampo sea disitinot');
                    
                    return {error:'Asegurate de que al menos un campo sea distinto'}
                }

                console.log('Datos cambiado');
                

                return {success:'Datos cambiados con éxito'}
                
            }else{
                console.log('El usuario no ha sido encontrado');
                
                return {error:'El usuario no ha sido encontrado'}
            }


        } catch (error) {
            console.log(error);

            return {error:'Error al editar los datos del perfil'}
            
        }
    }
}
