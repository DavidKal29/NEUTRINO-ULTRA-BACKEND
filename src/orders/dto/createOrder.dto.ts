import { IsString, MinLength, MaxLength, Matches, IsArray, ValidateNested, IsNumber, IsNotEmpty } from "class-validator";
import { Transform, Type } from "class-transformer";
import { escapeHtml } from "src/utils/escapeHtmls";
import { CartItemDTO } from "./cartItem.dto";

//Función para super sanitizar los datos
function sanitizeInput(value?: string): string | undefined {
  if (typeof value !== 'string'){
    return '';
  } 
  
  const cleaned = value.replace(/\s+/g, ' ').trim();
  const escaped = escapeHtml(cleaned);
  return escaped;
}

export class CreateOrderDTO {

  @IsString({ message: 'El nombre debe ser texto' })
  @MinLength(2, { message: 'El nombre es demasiado corto' })
  @MaxLength(30, { message: 'El nombre es demasiado largo' })
  @Transform(({ value }) => sanitizeInput(value))
  @IsNotEmpty({message:'Ningún campo puede estar vacío'})
  name?: string;

  @IsString({ message: 'El apellido debe ser texto' })
  @MinLength(2, { message: 'El apellido es demasiado corto' })
  @MaxLength(50, { message: 'El apellido es demasiado largo' })
  @Transform(({ value }) => sanitizeInput(value))
  @IsNotEmpty({message:'Ningún campo puede estar vacío'})
  lastname?: string;

  @IsString({ message: 'El DNI debe ser texto' })
  @Matches(/^\d{8}[A-Z]$/, { message: 'El DNI debe tener 8 números y una letra mayúscula al final' })
  @Transform(({ value }) => {
    const val = sanitizeInput(value);
    return val ? val.toUpperCase() : undefined;
  })
  @IsNotEmpty({message:'Ningún campo puede estar vacío'})
  dni?: string;

  @IsString({ message: 'El teléfono debe ser texto' })
  @Matches(/^\d{9,12}$/, { message: 'El teléfono debe tener entre 9 y 12 dígitos' })
  @Transform(({ value }) => sanitizeInput(value))
  @IsNotEmpty({message:'Ningún campo puede estar vacío'})
  phone?: string;

  @IsString({ message: 'La dirección debe ser texto' })
  @MinLength(5, { message: 'La dirección es demasiado corta' })
  @MaxLength(100, { message: 'La dirección es demasiado larga' })
  @Transform(({ value }) => sanitizeInput(value))
  @IsNotEmpty({message:'Ningún campo puede estar vacío'})
  address?: string;

  @IsNumber()
  totalPrice:number;

  @IsArray()
  @ValidateNested({each:true})
  @Type(()=>CartItemDTO)
  cart:CartItemDTO[];

}