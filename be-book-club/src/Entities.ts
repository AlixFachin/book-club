import "reflect-metadata";
import { Column,  Entity, PrimaryGeneratedColumn, EntityRepository, Repository } from "typeorm";

@Entity()
export class Book {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    title: string;
    @Column()
    language: string;
    @Column({nullable: true})
    tags?: string;
    @Column({nullable: true})
    genre?: string;
    @Column({nullable: true})
    memo?: string;
}

@EntityRepository(Book)
export class BookRepository extends Repository<Book> {
}
