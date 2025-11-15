import { IsString, IsEmail, MinLength, MaxLength, Matches, IsNotEmpty, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { escapeHtml } from "src/utils/escapeHtmls";

//Función para super sanitizar los datos
function sanitizeInput(value?: string): string | undefined {
  if (typeof value !== 'string'){
    return undefined;
  } 
  
  const cleaned = value.replace(/\s+/g, ' ').trim();
  const escaped = escapeHtml(cleaned);
  return escaped === '' ? undefined : escaped;
}

export class CreateUserDTO {

    @IsString({ message: 'El nombre debe ser texto' })
    @MinLength(2, { message: 'El nombre es demasiado corto' })
    @MaxLength(30, { message: 'El nombre es demasiado largo' })
    @Transform(({ value }) => sanitizeInput(value))
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    name?: string;

    @IsString({ message: 'El apellido debe ser texto' })
    @MinLength(2, { message: 'El apellido es demasiado corto' })
    @MaxLength(50, { message: 'El apellido es demasiado largo' })
    @Transform(({ value }) => sanitizeInput(value))
    @IsNotEmpty({ message: 'El apellido es obligatorio' })
    lastname?: string;

    @IsEmail({}, { message: 'Debes poner un email válido' })
    @MinLength(6, { message: 'Email demasiado corto' })
    @MaxLength(30, { message: 'Email demasiado largo' })
    @IsNotEmpty({ message: 'El email es obligatorio' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return undefined;
        const cleaned = value.replace(/\s+/g, '').trim().toLowerCase();
        return escapeHtml(cleaned);
    })
    email: string;

    @IsString({ message: 'El username debe ser texto' })
    @MinLength(3, { message: 'El username es demasiado corto' })
    @MaxLength(20, { message: 'El username es demasiado largo' })
    @IsNotEmpty({ message: 'El username es obligatorio' })
    @Transform(({ value }) => sanitizeInput(value))
    username: string;

    @IsOptional()
    @IsString({ message: 'El DNI debe ser texto' })
    @Matches(/^\d{8}[A-Z]$/, { message: 'El DNI debe tener 8 números y una letra mayúscula al final' })
    @Transform(({ value }) => {
        const val = sanitizeInput(value);
        return val ? val.toUpperCase() : undefined;
    })
    dni?: string;

    @IsOptional()
    @IsString({ message: 'El teléfono debe ser texto' })
    @Matches(/^\d{9,12}$/, { message: 'El teléfono debe tener entre 9 y 12 dígitos' })
    @Transform(({ value }) => sanitizeInput(value))
    phone?: string;

    @IsOptional()
    @IsString({ message: 'La dirección debe ser texto' })
    @MinLength(5, { message: 'La dirección es demasiado corta' })
    @MaxLength(100, { message: 'La dirección es demasiado larga' })
    @Transform(({ value }) => sanitizeInput(value))
    address?: string;

        
    @IsString({ message: 'La contraseña debe ser texto' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @MaxLength(30, { message: 'La contraseña no puede superar los 30 caracteres' })
    @IsNotEmpty({ message: 'Ningún campo puede estar vacío' })
    @Transform(({ value }) => sanitizeInput(value))
    @Matches(/[a-z]/, {
        message: 'La contraseña debe contener al menos una letra minúscula',
    })
    @Matches(/[A-Z]/, {
        message: 'La contraseña debe contener al menos una letra mayúscula',
    })
    @Matches(/\d/, {
        message: 'La contraseña debe contener al menos un número',
    })
    @Matches(/[\W_]/, {
        message: 'La contraseña debe contener al menos un carácter especial',
    })
    password: string;

    @IsString()
    rol:string
}