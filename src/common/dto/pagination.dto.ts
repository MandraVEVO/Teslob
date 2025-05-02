import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    
    @IsOptional()
    @IsPositive() 
    //transformar
    @Type(() => Number) //opcional si ponemos el enableImplicitConversion: true
    limit?: number;

    @IsOptional()
    // @IsPositive() 
    @Min(0)
    @Type(() => Number) //opcional si ponemos el enableImplicitConversion: true
    offset?: number;
}