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

            await orders.insertOne({id_user:new ObjectId(userID), products:dto.cart, address:dto.address,createdAt:new Date(), totalPrice:dto.totalPrice, metodoPago:dto.metodoPago, status:false})

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

    async getMyOrders(req:Request){
        try {
            const db = await conectarDB()
            const orders = db.collection('orders')

            const userID = req.user?._id

            const userOrders = await orders.find({id_user:new ObjectId(userID)}).toArray()

            if (userOrders.length>0) {
                return {success:'Pedidos obtenidos con éxito', orders:userOrders}
            }else{
                return {error:'Error al obtener tus pedidos, lo siento'}
            }
     

        } catch (error) {
            console.log(error);

            return {error:'Error al obtener los pedidos, lo sentimos'}
            
            
        }
    }

    async getOrder(req:Request,id_order:string){
        try {
            const db = await conectarDB()
            const orders = db.collection('orders')

            const userID = req.user?._id

            console.log(userID);
            console.log(id_order);

            const userOrder = await orders.findOne({id_user:new ObjectId(userID),_id:new ObjectId(id_order)})
            
            if (userOrder) {
                console.log('Pedido obtenido');
                
                return {success:'Pedido obtenido con éxito', order:userOrder}
            }else{
                console.log('Pedido no obtenido');
                
                return {error:'El pedido que intentas obtener no es tuyo o no existe'}
            }  

        } catch (error) {
            console.log(error);

            return {error:'Error al obtener el pedido, lo sentimos'}    
            
        }
    }

    async deleteOrder(req:Request,id_order:string){
        try {
            const db = await conectarDB()
            const orders = db.collection('orders')

            const userID = req.user?._id

            console.log(userID);
            console.log(id_order);

            await orders.deleteOne({id_user:new ObjectId(userID),_id:new ObjectId(id_order)})
            
            return {success:'Pedido eliminado con éxito'}

        } catch (error) {
            console.log(error);

            return {error:'Error al eliminar el pedido, lo sentimos'}    
            
        }
    }


}
