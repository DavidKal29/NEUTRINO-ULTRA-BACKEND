import { IsString, IsEmail, Matches,IsOptional,MinLength,MaxLength,Length,IsNotEmpty } from "class-validator";
import { Transform } from 'class-transformer';
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


export class LoginDTO {
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


}