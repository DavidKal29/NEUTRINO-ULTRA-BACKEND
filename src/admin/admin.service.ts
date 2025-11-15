import { Injectable } from '@nestjs/common';
import {conectarDB} from '../../src/database/mongo'
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import PDFDocument from 'pdfkit';
import { OrderDTO } from 'src/orders/dto/order.dto';
import 'pdfkit-table';
import { ProductDTO } from 'src/products/dto/product.dto';
import { CreateUserDTO } from './dto/createUser.dto';
import { EditUserDTO } from './dto/editUser.dto';
import { hash } from 'bcryptjs';

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
                console.log(Users);
                
                
                return {success:'Usuarios obtenidos con éxito', users:Users}
            }else{
                console.log('Usuarios no obtenidos');
                
                return {error:'No se han encontrado los usuarios de la web'}
            }
        
        } catch (error) {
            console.log(error);

            return {error:'Error al obtener los usuarios, lo sentimos'}
            
        }
    }

    async deleteUser(req:Request,id_user:string){
        try {

            if (req?.user?.rol != 'superadmin') {
                return {error:'Debes ser super-administrador para poder acceder a este panel'}
            }

            const db = await conectarDB()
            const users = db.collection('users')
            const orders = db.collection('orders')

            console.log(id_user);
            
            const user = await users.findOne({_id:new ObjectId(id_user)})

            if (!user) {
                return {error:'El usuario no existe'}
            }

            await orders.deleteMany({id_user:new ObjectId(id_user)})

            console.log('Pedidos del usuario eliminados');
            
            await users.deleteOne({_id:new ObjectId(id_user)})
            
            return {success:'Usuario eliminado con éxito'}

        } catch (error) {
            console.log(error);

            return {error:'Error al eliminar el usuario, lo sentimos'}    
            
        }
    }

    async createUser(req:Request,dto:CreateUserDTO){
        try {
            
            if (req?.user?.rol != 'superadmin') {
                return {error:'Debes ser super-administrador para poder acceder a este panel'}
            }

            const db = await conectarDB()
            const users = db.collection('users')
        
            const user_exists = await users.findOne({email:dto.email})
        
            if (user_exists) {
                return {error:'Email o Username ya están en uso por otro usuario'}
            }
        
            const encripted_password = await hash(dto.password, 10)
        
            await users.insertOne(
                {
                    email:dto.email, 
                    username:dto.username, 
                    password:encripted_password, 
                    name:dto.name, 
                    lastname:dto.lastname,
                    rol:dto.rol,
                    dni:dto.dni,
                    phone:dto.phone,
                    address:dto.address
                }
            )
        
            console.log('Insertado con éxito');
        
            return {success:'Cuenta creada con éxito'}
        } catch (error) {
            console.log('Error al insertar usuario');
        
            return {error:'Error al insertar usuario'} 
        }
    }

    async getUser(req:Request, id_user:string){
        try {
            
            if (req?.user?.rol != 'superadmin') {
                return {error:'Debes ser super-administrador para poder acceder a este panel'}
            }

            const db = await conectarDB()
            const users = db.collection('users')
        
            const user_exists = await users.findOne({_id:new ObjectId(id_user)},{projection:{password:0}})
        
            if (user_exists) {
                return {success:'Usuario encontrado',user:user_exists}
            }else{
                return {error:'No se ha podido obtener ese usuario'}
            }  
            
        } catch (error) {
            console.log('Error al encontrar al usuario');
        
            return {error:'Error al encontrar al usuario'} 
        }
    }

    async editUser(req:Request,dto:EditUserDTO){
        try {

            if (req?.user?.rol != 'superadmin') {
                return {error:'Debes ser super-administrador para poder acceder a este panel'}
            }

            const db = await conectarDB()
            const users = db.collection('users')
    
            console.log('Entramos a la ruta');
    
            const user_exists = await users.findOne({_id:new ObjectId(dto._id)})
    
            console.log('User exists definido');
    
            if (user_exists) {
    
                console.log('Usuario existe');

                const user_existent = await users.findOne({_id:{$ne:new ObjectId(dto._id)},$or:[{email:dto.email}, {username:dto.username}]})

                if (user_existent) {
                    return {error:'Email o Username ya están en uso por otro usuario'}
                }
                    
                const results = await users.updateOne(
                    {_id:new ObjectId(dto._id)},
                    {$set:{
                        email:dto.email,
                        username:dto.username,
                        name:dto.name,
                        lastname:dto.lastname,
                        address:dto.address,
                        phone:dto.phone,
                        dni:dto.dni,
                        rol:dto.rol
                    }},
                    {upsert:true}
                )
    
                if (results.modifiedCount === 0) {
                    console.log('Asegurate de que al menos un campo sea disitinto');
                        
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
