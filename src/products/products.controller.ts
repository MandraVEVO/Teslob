import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { ValidRoles } from 'src/auth/interface/valid-roles';
import { ApiResponse } from '@nestjs/swagger';
import { Product } from './entities';

@Controller('products')
//@Auth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiResponse({status: 201, description: 'Product created successfully', type: Product})//notacion para indicar lo que regresa el endpoint de status
  @ApiResponse({status: 400 , description: 'Bad Request'})
  @ApiResponse({status: 401 , description: 'Unauthorized'})

@Auth()
  create(@Body() createProductDto: CreateProductDto,
  @GetUser() user: User,

)
  
  {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll(@Query() paginationDto:PaginationDto) {
    // console.log( paginationDto );
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(@Param('id',ParseUUIDPipe) id: string,
   @Body() updateProductDto: UpdateProductDto,
   @GetUser() user: User 
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
