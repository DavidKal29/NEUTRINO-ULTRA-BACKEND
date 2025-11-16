import { Injectable } from '@nestjs/common';
import { conectarDB } from '../../src/database/mongo.js';
import { cookieOptions } from '../../src/cookieOptions/cookieOptions';
import { hash,compare } from 'bcryptjs';
import { RegisterDTO } from './dto/register.dto.js';
import { LoginDTO } from './dto/login.dto.js';
import { Response } from 'express';
import { RecuperationEmailDTO } from './dto/recuperationEmail.dto.js';
import { ChangePasswordDTO } from './dto/changePassword.dto.js';
import jwt from 'jsonwebtoken'
import { apiInstance } from '../../src/brevo/brevo.js';

@Injectable()
export class AuthService {

    async register(dto: RegisterDTO){
        try {
            const db = await conectarDB()
            const users = db.collection('users')

            const user_exists = await users.findOne({$or:[{email:dto.email}, {username:dto.username}]})

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

    async forgotPassword(dto:RecuperationEmailDTO){
        try {
            const db = await conectarDB()
            const users = db.collection('users')

            const user_exists = await users.findOne({email:dto.email}) 

            if (user_exists) {
                const token = jwt.sign({email:dto.email},process.env.JWT_SECRET)

                await users.updateOne({email: dto.email},{$set:{token:token}})

                const sendSmtpEmail = {
                    sender: { name: "Neutrino-Ultra", email: process.env.CORREO },
                    to: [{ email: dto.email }],
                    subject: "Recuperar Contraseña",
                    textContent: `Para recuperar la contraseña entra en este enlace -> ${process.env.FRONTEND_URL}/changePassword/${token}`,
                    htmlContent: `<p>Para recuperar la contraseña, entra a -> <a href="${process.env.FRONTEND_URL}/changePassword/${token}">Recuperar Contraseña</a></p>`
                };

                await apiInstance.sendTransacEmail(sendSmtpEmail)

                return {success:'Correo enviado con éxito'}

            } else {
                return {error:"No hay ninguna cuenta asociada a este correo"}
            }

        } catch (error) {
            console.error(error)
            return {error:"Error al enviar el email"}
        }
    }

    async changePassword(dto:ChangePasswordDTO, token:string){
        try{
            const db = await conectarDB()
            const users = db.collection('users')

            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            const email = decoded.email

            const userData = await users.findOne({email:email, token:token})
            
            if (userData) {
                
                if (dto.new_password===dto.confirm_password) {  
                    
                    const password_equals = await compare(dto.new_password,userData.password)
                        
                    if (password_equals) {
                        return {error:"La nueva contraseña no puede ser igual a la anterior"}
                    }else{
                        
                        const new_encripted_password = await hash(dto.new_password,10)

                        await users.updateOne({email:email},{$set:{password:new_encripted_password}})

                        await users.updateOne({email:email},{$set:{token:''}})
                            
                        return {success:"Contraseña cambiada con éxito"}
                    }
                }else{
                    
                    return {error:"Contraseñas no coinciden"}
                }
            }else{
                return {error:"Token inválido o expirado"}
            }
        }catch(error){
            console.log(error);
            
            return {error:"Token inválido o erroneo"}
        }
    }

    
    
}
