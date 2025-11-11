import { Injectable } from '@nestjs/common';
import {conectarDB} from '../../src/database/mongo'
import { ObjectId } from 'mongodb';
import { Request,Response } from 'express';
import { CreateOrderDTO } from './dto/createOrder.dto';
import { OrderDTO } from './dto/order.dto';
import PDFDocument from 'pdfkit';
import 'pdfkit-table';

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

            return {success:'Pedidos obtenidos con éxito', orders:userOrders}
     

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

    
    async getPDFOrder(res: Response, dto: OrderDTO) {
        try {
            const doc = new PDFDocument({ margin: 30 });

            //Para que lo que se envíe sea un archivo pdf directamente
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=pedido_${dto?._id}.pdf`);

            doc.pipe(res);

            //Título
            doc.fontSize(18).text('DETALLES DEL PEDIDO', { align: 'center' });
            doc.moveDown();

            //Información General
            doc.fontSize(12);

            doc.font('Helvetica-Bold').text('Número del pedido: ', { continued: true });
            doc.font('Helvetica').text(`${dto._id}`);

            doc.font('Helvetica-Bold').text('ID del usuario: ', { continued: true });
            doc.font('Helvetica').text(`${dto.id_user}`);

            doc.font('Helvetica-Bold').text('Fecha: ', { continued: true });
            doc.font('Helvetica').text(`${new Date(dto.createdAt).toLocaleString()}`);

            doc.font('Helvetica-Bold').text('Dirección: ', { continued: true });
            doc.font('Helvetica').text(`${dto.address}`);

            doc.font('Helvetica-Bold').text('Método de pago: ', { continued: true });
            doc.font('Helvetica').text(`${dto.metodoPago}`);

            doc.font('Helvetica-Bold').text('Estado: ', { continued: true });
            doc.font('Helvetica').text(`${dto.status ? 'Entregado' : 'No Entregado'}`);

            doc.moveDown();

            //Datos de los Productos
            doc.font('Helvetica-Bold').text('Productos:', { underline: true });
            doc.moveDown(0.5);

            dto.products.forEach((p, i) => {
                doc.font('Helvetica-Bold').text(`${i + 1}. ${p.name}`);
                doc.font('Helvetica').text(`   Precio Unitario: `, { continued: true }).text(`${p.price.toFixed(2)}€`);
                doc.font('Helvetica').text(`   Cantidad: `, { continued: true }).text(`${p.quantity}`);
                doc.font('Helvetica').text(`   Total: `, { continued: true }).text(`${p.totalPrice.toFixed(2)}€`);
                doc.moveDown(0.5);
            });

            //Total de todo
            doc.moveDown();
            doc.fontSize(14).font('Helvetica-Bold').text('Total del pedido: ', { continued: true });
            doc.font('Helvetica').text(`${dto.totalPrice.toFixed(2)}€`, { align: 'right' });

            doc.end();

        } catch (error) {
            console.log(error);
            if (!res.headersSent) {
                res.json({ error: 'Error al generar el PDF de tu pedido' });
            }
        }
    }




}
