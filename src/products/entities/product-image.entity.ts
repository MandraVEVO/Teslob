import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity({name: 'products_images'}) //nombre de la tabla
export class ProductImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;

    @ManyToOne(
        ()=> Product,
        (product) => product.images,
        { onDelete: 'CASCADE' } //si se elimina el producto se eliminan las imagenes
    )
    product: Product

}   