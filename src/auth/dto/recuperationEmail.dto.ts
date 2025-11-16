import { IsEmail, MinLength, MaxLength, IsNotEmpty } from "class-validator";
import { Transform } from 'class-transformer';
import { escapeHtml } from "src/utils/escapeHtmls";


export class RecuperationEmailDTO {
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


}