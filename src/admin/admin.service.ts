import { Injectable } from '@nestjs/common';
import {conectarDB} from '../../src/database/mongo'
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import PDFDocument from 'pdfkit';
import { OrderDTO } from 'src/orders/dto/order.dto';
import 'pdfkit-table';
import { ProductDTO } from 'src/products/dto/product.dto';

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

            const sortedOrders = [...Orders].reverse()


            return {success:'Pedidos obtenidos con éxito', orders:sortedOrders}
     

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

    async changeProductActive(id_product:string, newActive:string){
        try {
            const db = await conectarDB()
            const products = db.collection('products')
            
            const product = await products.findOne({_id:new ObjectId(id_product)})

            if (!product) {
                return {error:'Ese producto no existe'}
            }

            const results = await products.updateOne({_id:new ObjectId(id_product)},{$set:{active:newActive}})

            if (results.modifiedCount === 0) {
                return {error:'El producto ya tiene puesta esa configuración de actividad'}
            }

            return {success:'Configuración de actividad del producto cambiada'}
     

        } catch (error) {
            console.log(error);

            return {error:'Error al cambiar la actividad del producto, inténtelo de nuevo'}
            
        }
    }

    async getPDFOrdersResume(res:Response, dto:OrderDTO[]) {
        try {
            const doc = new PDFDocument({ margin: 30 });
    
            //Para que lo que se envíe sea un archivo pdf directamente
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=detalles_pedidos_${new Date().toLocaleDateString("es-ES")}.pdf`);
    
            doc.pipe(res);
    
            //Título
            doc.fontSize(18).text('RESUMEN DE LOS PEDIDOS', { align: 'center' });
            doc.moveDown();
    
    
            //Datos de los Pedidos
            doc.font('Helvetica-Bold').text('PEDIDOS:', { underline: true });
            doc.moveDown(0.5);

            let total_earnings = 0;
    
            //Sección para cada pedido
            dto.forEach((p, i) => {
                doc.font('Helvetica-Bold').text(`Pedido ${i + 1}`);
                doc.font('Helvetica').text(`   Username: `, { continued: true }).text(`${p.username}`);
                doc.font('Helvetica').text(`   Fecha: `, { continued: true }).text(`${new Date(p.createdAt).toLocaleString()}`);
                doc.font('Helvetica').text(`   Estado: `, { continued: true }).text(`${p.status}`);
                doc.font('Helvetica').text(`   Precio Total: `, { continued: true }).text(`${p.totalPrice.toFixed(2)}€`);
                doc.moveDown(0.5);
                
                total_earnings += p.totalPrice

            });

            //Ganancias totales
            doc.moveDown();
            doc.fontSize(14).font('Helvetica-Bold').text('GANANCIAS TOTALES: ', { continued: true });
            doc.font('Helvetica').text(`${total_earnings.toFixed(2)}€`, { align: 'right' });
    
            doc.end();
    
        } catch (error) {
            console.log(error);
            if (!res.headersSent) {
                res.json({ error: 'Error al generar el PDF de tu pedido' });
            }
        }
    }

    async editProduct(dto:ProductDTO){
            try {
                const db = await conectarDB()
                const products = db.collection('products')
    
                const productID = dto._id
    
                const product_exists = await products.findOne({_id:new ObjectId(productID)})
                
                if (product_exists) {
                    
                    const results = await products.updateOne(
                        {_id:new ObjectId(productID)},
                        {$set:{
                            name:dto.name,
                            description:dto.description,
                            price:dto.price,
                            stock:dto.stock,
                            category:dto.category,
                            brand:dto.brand,
                        }},
                        {upsert:true}
                    )
    
                    if (results.modifiedCount === 0) {
                        return {error:'Asegurate de que al menos un campo sea distinto'}
                    }
    
                    console.log('Datos cambiados');
                    
    
                    return {success:'Datos cambiados con éxito'}
                    
                }else{
                    console.log('El producto no ha sido encontrado');
                    
                    return {error:'El producto no ha sido encontrado'}
                }
    
    
            } catch (error) {
                console.log(error);
    
                return {error:'Error al editar los datos del producto'}
                
            }
    }

    async getAllUsers(req:Request){
        try {

            if (req?.user?.rol != 'superadmin') {
                return {error:'Debes ser super-administrador para poder acceder a este panel'}
            }

            const db = await conectarDB()
            const users = db.collection('users')

            const userID = req?.user?._id

            const Users = await users.find({_id:{$ne:new ObjectId(userID)}},{projection:{password:0}}).toArray() 

            if (Users.length>0) {
                console.log('Usuarios obtenidos con éxito');
                
                return {success:'Usuarios obtenidos con éxito', users:Users}
            }else{
                return {error:'No se han encontrado los usuarios de la web'}
            }
        
        } catch (error) {
            console.log(error);

            return {error:'Error al obtener los usuarios, lo sentimos'}
            
        }
    }
}
