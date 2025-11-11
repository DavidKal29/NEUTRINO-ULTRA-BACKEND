import { Injectable } from '@nestjs/common';
import { conectarDB } from '../../src/database/mongo.js';
import { cookieOptions } from '../../src/cookieOptions/cookieOptions';
import { hash,compare } from 'bcryptjs';
import { RegisterDTO } from './dto/register.dto.js';
import { LoginDTO } from './dto/login.dto.js';
import { Response } from 'express';

@Injectable()
export class AuthService {

    async register(dto: RegisterDTO){
        try {
            const db = await conectarDB()
            const users = db.collection('users')

            const user_exists = await users.findOne({email:dto.email})

            if (user_exists) {
                return {error:'Email o Username ya están en uso por otro usuario'}
            }

            const encripted_password = await hash(dto.password, 10)

            await users.insertOne({email:dto.email, username:dto.username, password:encripted_password, name:dto.name, lastname:dto.lastname,rol:'client'})

            console.log('Insertado con éxito');

            const userData = await users.findOne({email:dto.email})

            return {success:'Cuenta creada con éxito', userID:userData._id}
        } catch (error) {
            console.log('Error al insertar usuario');

            return {error:'Error al insertar usuario'} 
        }
    }


    async login(dto:LoginDTO){
        try {
            const db = await conectarDB()
            const users = db.collection('users')

            const user_exists = await users.findOne({email:dto.email})

            if (user_exists) {

                const match = await compare(dto.password,user_exists.password)

                if (match) {
                    return {success:'Usuario logueado con éxito', userID:user_exists._id}
                }else{
                    return {error:'Contraseña Incorrecta'} 
                }
            }else{
                return {error:'Email Incorrecto'} 
            }

            
        } catch (error) {
            console.log('Error al loguear usuario');

            return {error:'Error al loguear usuario'} 
        }   
    }

    logout(res:Response){
        try {
            res.clearCookie('token',cookieOptions)
            res.json({success:'Sesión Cerrada'})
        } catch (error) {
            res.json({error:'Error al cerrar sesión'})
        }
    }

    
    
}
