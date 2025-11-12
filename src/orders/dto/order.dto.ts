import { IsString,IsArray, ValidateNested, IsNumber, IsBoolean } from "class-validator";
import { Type } from "class-transformer";
import { CartItemDTO } from "./cartItem.dto";

export class OrderDTO {

    @IsString()
    _id:string

    @IsString()
    id_user:string

    @IsString()
    address:string

    @IsString()
    status:string

    @IsString()
    createdAt:string
    
    @IsNumber()
    totalPrice:number;

    @IsArray()
    @ValidateNested({each:true})
    @Type(()=>CartItemDTO)
    products:CartItemDTO[];

    @IsString()
    metodoPago:string

}