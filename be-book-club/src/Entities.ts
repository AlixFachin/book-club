import "reflect-metadata";
import { Column,  Entity, PrimaryGeneratedColumn, EntityRepository, Repository, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";

// Entities Module
// Describes all the entities of the app

// NOTE:
// When creating a new entity, do not forget to add the entity class in the ConnectionOptions.Entities parameter (db.ts file)


// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// Book -> This is the abstract book, i.e. represented with an ISBN
// (To be clear, *NOT* the physical instance of a book)

@Entity({name: "Books"})
export class Book {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column({nullable: true, length: 13})
    ISBN: string;
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
    @OneToMany(() => Inventory, inventory => inventory.book, {
        onDelete: "RESTRICT",
        cascade: false,
    })
    instances: Inventory[];
}

@EntityRepository(Book)
export class BookRepository extends Repository<Book> {
}

// User -> Represents a user in the app

@Entity({name: "Profiles"})
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column({length: 50})
    fullName: string;
    @Column({length:10})
    postCode: string;
    @Column()
    country: string;
    @Column()
    language: string;
    @CreateDateColumn()
    createdDate: Date;
    @OneToMany(()=>Inventory, inventory => inventory.owner, {
        onDelete: "RESTRICT",
        cascade: false,
    })
    books: Inventory[];
}

@EntityRepository(User)
export class UserRepository extends Repository<User>{

}

// Inventory -> Represents a physical book owned by a app user

@Entity({name:"Inventories"})
export class Inventory {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @ManyToOne(() => User, user => user.books)
    owner: User;
    @ManyToOne(() => Book, book => book.instances)
    book: Book;
}

@EntityRepository(Inventory)
export class InventoryRepository extends Repository<Inventory> {

}