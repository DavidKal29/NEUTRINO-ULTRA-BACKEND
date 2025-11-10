import { IsString, IsEmail, MinLength, MaxLength, Matches, IsNotEmpty, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { escapeHtml } from "src/utils/escapeHtmls";

export class EditProfileDTO {

  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  @MinLength(2, { message: 'El nombre es demasiado corto' })
  @MaxLength(30, { message: 'El nombre es demasiado largo' })
  @Transform(({ value }) => {
    const val = (value || '').trim();
    return val === '' ? undefined : escapeHtml(val);
  })
  name?: string;

  @IsOptional()
  @IsString({ message: 'EL appellido debe ser un texto' })
  @MinLength(2, { message: 'EL apellido es demasiado corto' })
  @MaxLength(50, { message: 'EL apellido es demasiado largo' })
  @Transform(({ value }) => {
    const val = (value || '').trim();
    return val === '' ? undefined : escapeHtml(val);
  })
  lastname?: string;

  @IsEmail({}, { message: 'Debes poner un email válido' })
  @MinLength(6, { message: 'Email demasiado corto' })
  @MaxLength(30, { message: 'Email demasiado largo' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  @Transform(({ value }) => escapeHtml((value || '').trim().replace(/\s+/g, '').toLowerCase()))
  email: string;

  @IsString({ message: 'El username debe ser texto' })
  @MinLength(3, { message: 'El username es demasiado corto' })
  @MaxLength(20, { message: 'El username es demasiado largo' })
  @IsNotEmpty({ message: 'El username es obligatorio' })
  @Transform(({ value }) => escapeHtml((value || '').trim()))
  username: string;

  @IsOptional()
  @IsString({ message: 'El DNI debe ser texto' })
  @Matches(/^\d{8}[A-Z]$/, { message: 'El DNI debe tener 8 números y una letra mayúscula al final' })
  @Transform(({ value }) => {
    const val = (value || '').trim().toUpperCase();
    return val === '' ? undefined : escapeHtml(val);
  })
  dni?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser texto' })
  @Matches(/^\d{9,12}$/, { message: 'El teléfono debe tener entre 9 y 12 dígitos' })
  @Transform(({ value }) => {
    const val = (value || '').trim();
    return val === '' ? undefined : escapeHtml(val);
  })
  phone?: string;


  @IsOptional()
  @IsString({ message: 'La dirección debe ser texto' })
  @MinLength(5, { message: 'La dirección es demasiado corta' })
  @MaxLength(100, { message: 'La dirección es demasiado larga' })
  @Transform(({ value }) => {
    const val = (value || '').trim();
    return val === '' ? undefined : escapeHtml(val);
  })
  address?: string;
}

