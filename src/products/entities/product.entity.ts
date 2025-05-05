import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";


@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        unique: true, //no puede haber 2 productos con el mismo nombre
    })
    title: string;

    @Column('float',{
        default: 0,

    })
    price: number;


    @Column({
        type: 'text',
        nullable: true,//acepta nulos
    })
    description: string;

    @Column('text',{
        unique: true,
    })
    slug: string;

    @Column('numeric',{
        default: 0,
    })
    stock: number;

    @Column('text',{
        array: true,
    })
    sizes: string[];

    @Column('text')
    gender: string;

    @Column(
        {
            type: 'text',
            array: true,
            default: [],
        }
    )
    tags: string[];

    //relacion uno a muchos con imagenes 
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        {cascade: true} 
    )
    images?: ProductImage[];


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
