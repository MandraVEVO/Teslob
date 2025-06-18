import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/data-seed';
import { Product } from '../products/entities/product.entity';


@Injectable()
export class SeedService {

  constructor(
    private readonly ProductsService: ProductsService,
  ) {}

  async runSeed() {
    await this.insertNewProducts();
    return 'Seed executed successfully';
  }

  private async insertNewProducts(){
    await this.ProductsService.deleteAllProducts();

    const products = initialData.products;
    const insertPromises: Promise<Product | undefined>[] = [];

    // products.forEach(product => {
    //   insertPromises.push(this.ProductsService.create(product));
    // });

    await Promise.all(insertPromises);

    return true;
  }
}
