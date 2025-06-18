import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    
    @ApiProperty({
        default: 5,
        description: 'Number of items to return',
    })
    @IsOptional()
    @IsPositive() 
    //transformar
    @Type(() => Number) //opcional si ponemos el enableImplicitConversion: true
    limit?: number;

    @ApiProperty({
        default: 0,
        description: 'Number of rows you want to skip',
    })
    @IsOptional()
    // @IsPositive() 
    @Min(0)
    @Type(() => Number) //opcional si ponemos el enableImplicitConversion: true
    offset?: number;
}