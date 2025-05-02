import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


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
}
