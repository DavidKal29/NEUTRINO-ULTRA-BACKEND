import { IsString, IsNumber } from "class-validator";


export class CartItemDTO {
    @IsString()
    _id:string

    @IsString()
    name:string

    @IsNumber()
    price:number

    @IsNumber()
    oldPrice:number

    @IsString()
    image:string

    @IsString()
    brand:String

    @IsString()
    category:string

    @IsNumber()
    quantity:number

    @IsNumber()
    totalPrice:number
}