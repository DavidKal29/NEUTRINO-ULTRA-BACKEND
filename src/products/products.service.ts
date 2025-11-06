import { Injectable } from '@nestjs/common';
import { conectarDB } from '../../src/database/mongo.js'

@Injectable()
export class ProductsService {
    async getProducts(category:String){
        try {
            const db = await conectarDB()
            const products = db.collection('products')

            const dataProducts = await products.find({category:category}).toArray()

            console.log('Los productos:',dataProducts);

            return {products: dataProducts}
        } catch (error) {
            console.log(error);

            return {error:'Error al obtener los productos'}
            
        }
    }

    async getNewProducts(){
        try {
            const db = await conectarDB()
            const products = db.collection('products')

            const dataProducts = await products.find().limit(10).toArray()

            console.log('Los productos:',dataProducts);

            return {products: dataProducts}
        } catch (error) {
            console.log(error);

            return {error:'Error al obtener los productos'}
            
        }
    }
}
