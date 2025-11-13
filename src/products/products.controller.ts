import { Controller,Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor (private readonly productsService:ProductsService){}

    @Get('getProducts/:category')
    getProducts(@Param('category') category:string){
        return this.productsService.getProducts(category)
    }

    @Get('getProduct/:id')
    getProduct(@Param('id') id:string){
        return this.productsService.getProduct(id)
    }

    @Get('getNewProducts')
    getNewProducts(){
        return this.productsService.getNewProducts()
    }

    @Get('getMostPopularProducts')
    getMostPopularProducts(){
        return this.productsService.getMostPopularProducts()
    }

    @Get('getAllProducts')
    getAllProducts(){
        return this.productsService.getAllProducts()
    }

    @Get('getAllProductData/:id')
    getAllProductData(@Param('id') id:string){
        return this.productsService.getAllProductData(id)
    }

}
