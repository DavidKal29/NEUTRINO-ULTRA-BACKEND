import {IsString,MinLength,MaxLength,IsNotEmpty,IsNumber,IsInt,Min,Max,} from "class-validator";
import { Transform } from "class-transformer";
import { escapeHtml } from "src/utils/escapeHtmls";

// Función para super sanitizar los datos
function sanitizeInput(value?: string): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }

    const cleaned = value.replace(/\s+/g, " ").trim();
    const escaped = escapeHtml(cleaned);
    return escaped === "" ? undefined : escaped;
}

export class ProductDTO {
    @IsString()
    _id:string

    @IsString({ message: "El nombre debe ser texto" })
    @MinLength(5, { message: "El nombre es demasiado corto" })
    @MaxLength(200, { message: "El nombre es demasiado largo" })
    @Transform(({ value }) => sanitizeInput(value))
    @IsNotEmpty({ message: "El nombre es obligatorio" })
    name?: string;

    @IsString({ message: "La descripción debe ser texto" })
    @MinLength(10, { message: "La descripción es demasiado corta" })
    @MaxLength(400, { message: "La descripción es demasiado larga" })
    @Transform(({ value }) => sanitizeInput(value))
    @IsNotEmpty({ message: "La descripción es obligatoria" })
    description?: string;

    @Transform(({ value }) => {
        const num = parseFloat(value);
        return isNaN(num) ? undefined : num;
    })
    @IsNumber(
        { allowInfinity: false, allowNaN: false },
        { message: "El precio debe ser un número válido" }
    )
    @Min(0.01, { message: "El precio debe ser mayor que 0" })
    @Max(999999.99, { message: "El precio es demasiado alto" })
    @IsNotEmpty({ message: "El precio es obligatorio" })
    price?: number;

    @Transform(({ value }) => {
        const num = parseInt(value, 10);
        return isNaN(num) ? undefined : num;
    })
    @IsInt({ message: "El stock debe ser un número entero" })
    @Min(0, { message: "El stock no puede ser negativo" })
    @Max(1000000, { message: "El stock es demasiado alto" })
    @IsNotEmpty({ message: "El stock es obligatorio" })
    stock?: number;

    @Transform(({ value }) => {
        const num = parseInt(value, 10);
        return isNaN(num) ? undefined : num;
    })
    @IsInt({ message: "El descuento debe ser un número entero" })
    @Min(0, { message: "El descuento no puede ser negativo" })
    @Max(100, { message: "El descuento no puede superar el 100%" })
    @IsNotEmpty({ message: "El descuento es obligatorio" })
    discount?: number;


    @IsString()
    category:string

    @IsString()
    brand:string
}
