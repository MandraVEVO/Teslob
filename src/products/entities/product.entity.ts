import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProductImage } from "./product-image.entity";
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';


@Entity({name: 'products'}) //nombre de la tabla
export class Product {

    @ApiProperty({
        example: 'd3f4c5b6-7e8f-9a0b-1c2d-3e4f5g6h7i8j',
        description: 'Unique identifier for the product',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shirt',
        description: 'Title of the product',
        uniqueItems: true
    })
    @Column('text',{
        unique: true, //no puede haber 2 productos con el mismo nombre
    })
    title: string;

    @ApiProperty({
        example: 19.99,
        description: 'Price of the product'
    })
    @Column('float',{
        default: 0,

    })
    price: number;

@ApiProperty({
    example: 'A comfortable cotton t-shirt',
    description: 'Description of the product',
    default: null //no es obligatorio
})
    @Column({
        type: 'text',
        nullable: true,//acepta nulos
    })
    description: string;

    @ApiProperty({
        example: 't-shirt_comfortable',
        description: 'Unique slug for the product, used in URLs',
        uniqueItems: true,
    })
    @Column('text',{
        unique: true,
    })
    slug: string;

    @ApiProperty({
        example: 100,
        description: 'Stock quantity of the product',
        default: 0,
    })
    @Column('numeric',{
        default: 0,
    })
    stock: number;

    @ApiProperty({
        example: ['S', 'M', 'L', 'XL'],
        description: 'Available sizes for the product',
        
    })
    @Column('text',{
        array: true,
    })
    sizes: string[];

    @ApiProperty({
        example: 'M',
        description:'gender for the product',
    })
    @Column('text')
    gender: string;

    @ApiProperty()
    @Column(
        {
            type: 'text',
            array: true,
            default: [],
        }
    )
    tags: string[];

    //relacion uno a muchos con imagenes 
    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        {cascade: true,
            eager: true, //esto es para que se carguen las imagenes al momento de cargar el producto
        } 
    )
    images?: ProductImage[];

    @ManyToOne(
        ()=> User,
        (user) => user.product, //relacion inversa
        { eager: true } //eager para que se cargue el usuario al momento de cargar el producto
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert(){
        if(!this.slug){
            this.slug = this.title;
        }

        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", '')
    }

    @BeforeUpdate() //antes de actualizar el slug revisa para que tenga el formato correcto
    checkSlugUpdate(){
        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", '')
    }
    
}
