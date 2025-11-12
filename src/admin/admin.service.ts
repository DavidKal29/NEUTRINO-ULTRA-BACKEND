import { Injectable } from '@nestjs/common';
import {conectarDB} from '../../src/database/mongo'
import { Request } from 'express';
import { ObjectId } from 'mongodb';

@Injectable()
export class AdminService {

    profile(){
        return {success:'Entraste a perfil'}
    }


    async getAllOrders(){
        try {
            const db = await conectarDB()
            const orders = db.collection('orders')

            const Orders = await orders.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'id_user',
                        foreignField: '_id',
                        as: 'userData'
                    }
                },
                {
                    $unwind: '$userData'
                },
                {
                    $addFields: {
                        username: '$userData.username'
                    }
                },
                {
                    $project: {
                        userData: 0 
                    }
                }
            ]).toArray();


            return {success:'Pedidos obtenidos con éxito', orders:Orders}
     

        } catch (error) {
            console.log(error);

            return {error:'Error al obtener los pedidos, lo sentimos'}
            
        }
    }

    async changeOrderStatus(id_order:string, newStatus:string){
        try {
            const db = await conectarDB()
            const orders = db.collection('orders')
            
            const order = await orders.findOne({_id:new ObjectId(id_order)})

            if (!order) {
                return {error:'Ese pedido no existe'}
            }

            const results = await orders.updateOne({_id:new ObjectId(id_order)},{$set:{status:newStatus}})

            if (results.modifiedCount === 0) {
                return {error:'El estado del pedido es el mismo que el que se intenta cambiar'}
            }

            return {success:'Estado del pedido cambiado con éxito'}
     

        } catch (error) {
            console.log(error);

            return {error:'Error al cambiar el estado del pedido, inténtelo de nuevo'}
            
        }
    }
}
