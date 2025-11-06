import { Injectable } from '@nestjs/common';
import { conectarDB } from '../../src/database/mongo.js'

@Injectable()
export class ProductsService {
    async getProducts(){
        try {
            const db = await conectarDB()
            const products = db.collection('products')

            const dataProducts = await products.find({}).toArray()

            console.log('Los productos:',dataProducts);

            return {products: dataProducts}
        } catch (error) {
            console.log(error);

            return {error:'Error al obtener los productos'}
            
        }
    }
}
