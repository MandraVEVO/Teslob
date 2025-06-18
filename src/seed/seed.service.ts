import { Inject, Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/data-seed';
import { Product } from '../products/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { use } from 'passport';


@Injectable()
export class SeedService {

  constructor(
    private readonly ProductsService: ProductsService,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertNewUsers();
    await this.insertNewProducts(adminUser);
    return 'Seed executed successfully';
  }

  private async deleteTables() {
    await this.ProductsService.deleteAllProducts();
   const queryBuilder = this.userRepository.createQueryBuilder();
   await queryBuilder
   .delete()
   .where({})
    .execute();


  }

  private async insertNewUsers() {
    const seedUsers = initialData.users;
    

    const users: User[] = [];
    seedUsers.forEach(user => {
      users.push(this.userRepository.create(user));
    });

    const dbUsers = await this.userRepository.save(seedUsers)
    return dbUsers[0]; //se usa asi para que se pueda actualizar el usuario con su ID
  }

  private async insertNewProducts(user: User){
    await this.ProductsService.deleteAllProducts();

    const products = initialData.products;
    const insertPromises: Promise<Product | undefined>[] = [];

    products.forEach(product => {
      insertPromises.push(this.ProductsService.create(product, user));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
