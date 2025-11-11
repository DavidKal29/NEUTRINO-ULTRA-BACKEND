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

            const Orders = await orders.find({}).toArray()

            return {success:'Pedidos obtenidos con éxito', orders:Orders}
     

        } catch (error) {
            console.log(error);

            return {error:'Error al obtener los pedidos, lo sentimos'}
            
            
        }
    }
}
