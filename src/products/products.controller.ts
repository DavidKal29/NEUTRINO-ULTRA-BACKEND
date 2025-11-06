import { Controller,Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor (private readonly productsService:ProductsService){}

    @Get('getProducts/:category')
    getProducts(@Param('category') category:string){
        return this.productsService.getProducts(category)
    }

    @Get('getNewProducts')
    getNewProducts(){
        return this.productsService.getNewProducts()
    }

}
