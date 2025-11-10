import { Injectable } from '@nestjs/common';
import {conectarDB} from '../../src/database/mongo'
import { ObjectId } from 'mongodb';
import { Request } from 'express';
import { CreateOrderDTO } from './dto/createOrder.dto';

@Injectable()
export class OrdersService {
    async createOrder(req:Request, dto:CreateOrderDTO){
        try {
            const db = await conectarDB()
            const orders = db.collection('orders')
            const users = db.collection('users')
            const products = db.collection('products')

            const userID = req.user?._id

            await users.updateOne({_id:new ObjectId(userID)},{$set:{name:dto.name, lastname:dto.lastname, dni:dto.dni, address:dto.address,phone:dto.phone}})

            await orders.insertOne({id_user:new ObjectId(userID), products:dto.cart, address:dto.address,createdAt:new Date(), totalPrice:dto.totalPrice, metodoPago:dto.metodoPago})

            const cart = dto.cart

            for (let i = 0; i < cart.length; i++) {
                await products.updateOne({_id:new ObjectId(cart[i]._id)},{$inc:{sales:cart[i].quantity}})
                
            }

            return {success:'Pedido creado con éxito'}

        } catch (error) {
            console.log(error);

            return {error:'Error al crear el pedido, lo sentimos'}
            
            
        }
    }
}
