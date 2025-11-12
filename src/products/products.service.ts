import { Injectable } from '@nestjs/common';
import { conectarDB } from '../../src/database/mongo.js'
import { ObjectId } from 'mongodb';

@Injectable()
export class ProductsService {
    async getProducts(category:string){
        try {
            const db = await conectarDB()
            const products = db.collection('products')

            const dataProducts = await products.find({category:category}).toArray()

            return {products: dataProducts}
        } catch (error) {
            console.log(error);

            return {error:'Error al obtener los productos'}
            
        }
    }

    async getProduct(id:string){
        try {
            const db = await conectarDB()
            const products = db.collection('products')

            const product = await products.findOne({_id: new ObjectId(id)})

            return {product: product}
        } catch (error) {
            console.log(error);

            return {error:'Error al obtener el producto'}
            
        }
    }

    async getNewProducts(){
        try {
            const db = await conectarDB()
            const products = db.collection('products')

            const dataProducts = await products.find().limit(10).toArray()

            return {products: dataProducts}
        } catch (error) {
            console.log(error);

            return {error:'Error al obtener los productos'}
            
        }
    }

    async getMostPopularProducts(){
        try {
            const db = await conectarDB()
            const products = db.collection('products')

            const dataProducts = await products.find().sort({sales:-1}).limit(10).toArray()

            return {products: dataProducts}
        } catch (error) {
            console.log(error);

            return {error:'Error al obtener los productos'}
            
        }
    }

    async getAllProducts(){
        try {
            const db = await conectarDB()
            const products = db.collection('products')

            const dataProducts = await products.find({}).toArray()

            return {products: dataProducts}
        } catch (error) {
            console.log(error);

            return {error:'Error al obtener los productos'}
            
        }
    }
}
