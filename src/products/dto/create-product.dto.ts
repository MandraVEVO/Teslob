import { IsArray, IsEAN, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";


export class CreateProductDto {
    @IsString()
    @MinLength(1)
    title: string;
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;
    @IsString()
    @IsOptional()
    description?: string;
    @IsString()
    @IsOptional()
    slug?: string;

    @IsInt()//solo enteros
    @IsPositive()
    @IsOptional()
    stock?: number;
    
    @IsString({each: true})
    @IsArray()
    sizes: string[];
    @IsIn(['men','woman','unisex']) //validar que el valor sea uno de los tres
    gender: string;

    @IsString({each: true})//validar que cada elemento del array sea un string
    @IsOptional()
    @IsArray()
    tags: string[]; //no es necesario validar porque no es obligatorio
}

