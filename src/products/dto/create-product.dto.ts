import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEAN, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";


export class CreateProductDto {
    @ApiProperty({
        
            description: 'Product title',
            nullable: true,
            minLength: 1,
        })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty()
    @IsInt()//solo enteros
    @IsPositive()
    @IsOptional()
    stock?: number;
    
    @ApiProperty()
    @IsString({each: true})
    @IsArray()
    sizes: string[];

    @ApiProperty()
    @IsIn(['men','woman','unisex']) //validar que el valor sea uno de los tres
    gender: string;

    @IsString({each: true})//validar que cada elemento del array sea un string
    @IsOptional()
    @IsArray()
    tags: string[]; //no es necesario validar porque no es obligatorio


    @ApiProperty()
    @IsString({each: true})//validar que cada elemento del array sea un string
    @IsOptional()
    @IsArray()
    images?: string[]; //no es necesario validar porque no es obligatorio
}

