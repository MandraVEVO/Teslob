import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities';
import { User } from 'src/auth/entities/user.entity';
@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) {}


  async create(createProductDto: CreateProductDto, user: User) { //tratar de usar patron repository
    try {


      // if (!createProductDto.slug) { esto es para que el el slug se mande con - o  se rellene
       //   createProductDto.slug = createProductDto.title.toLowerCase().replaceAll(' ', '-').replaceAll("", '_')
      // }
      const {images = [], ...productDetails} = createProductDto; //desestructuramos el array de imagenes para que no se guarde en la base de datos

      const product = this.productRepository.create({
        ...productDetails,
      images: images.map(images => this.productImageRepository.create({url: images})), 
      user,//esto es para que se guarde en la base de datos
      
      });
      await this.productRepository.save(product);
      return product;

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  //paginar
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations:{
        images: true,
      }
      //to_do: relaciones
    })

    return products.map(product => ({
      ...product,
      images: (product.images ?? []).map(img => img.url), //esto es para que solo se guarde la url de la imagen
    }))
  }

  async findOne(term: string) {
    let product: Product | null = null;

    if(isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      // product = await this.productRepository.findOneBy({ slug: term });
      const queryBuilder = this.productRepository.createQueryBuilder('prod'); //para evitar inyeccion de sql
      product = await queryBuilder.where('UPPER(title) = :title or slug = :slug',{ //funcion para que busque por slug o nombre sin importar las mayusculas o caracteres especiales
        title: term.toUpperCase(),
        slug: term.toLowerCase(),
      })
      .leftJoinAndSelect('prod.images', 'prodImages') //esto es para que se carguen las imagenes al momento de cargar el producto
      .getOne();
    }

    if (!product) throw new BadRequestException(`Product with id ${term} not found`);
    
    return product;
  }

  async findOnePlain(term: string) {
    const {images = [], ...rest} = await this.findOne(term);
    return {
      ...rest,
      images: images.map(img => img.url), //esto es para que solo se guarde la url de la imagen
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {

    const {images, ...toUpdate} = updateProductDto; //desestructuramos el array de imagenes para que no se guarde en la base de datos

   const product = await this.productRepository.preload({ //le dice a typeorm que busque el id y lo reemplace por el nuevo
    id: id,
    ...toUpdate,
   }); //esto no actualiza solo lo prepara para actualizar
  
   if (!product) throw new NotFoundException(`Product with id ${id} not found`);

   // create query runner
   const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); 

    try {

      if (images){///borra las imagenes viejas
        await queryRunner.manager.delete(ProductImage,{product:{id}}) ///tener cuidado con el criterio ya que esto puede borrar todas las imagenes

        product.images = images.map(image => this.productImageRepository.create({url: image})); //esto es para que se haga la actualizacion de las imagenes
      }

      product.user = user; //esto es para que se guarde el usuario que actualiza el producto
      await queryRunner.manager.save(product); //esto es para que se cree la instancia para guardar

      await queryRunner.commitTransaction(); //esto es para que se guarde en la base de datos
      await queryRunner.release(); //esto es para que se libere la conexion 
      
      
      // await this.productRepository.save(product);
      return product;
    } catch (error) {

      await queryRunner.rollbackTransaction(); 
      await queryRunner.release(); 
      this.handleExceptions(error);
    }
   
  
  }

   async remove(id: string) {
    const product = await this.findOne(id);
    
    await this.productRepository.remove(product);
  }


  private handleExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query
        .delete()
        .where({})
        .execute();
    } catch (error) {
      this.handleExceptions(error);
    }
  }
}
