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
    @OneToMany(() => InventoryItem, inventory => inventory.book, {
        onDelete: "RESTRICT",
        cascade: false,
    })
    instances: InventoryItem[];
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
    @OneToMany(()=>InventoryItem, inventory => inventory.owner, {
        onDelete: "RESTRICT",
        cascade: false,
    })
    inventory: InventoryItem[];
}

@EntityRepository(User)
export class UserRepository extends Repository<User>{

}

// Inventory -> Represents a physical book owned by a app user

export enum BookVisibility {
    PUBLIC = 'public',
    PRIVATE = 'private'
}

export enum BookStatus {
    AVAILABLE = 'avail',
    AWAY = 'away' // cannot be booked (borrowed, held, ...)
}

@Entity({name:"Inventories"})
export class InventoryItem {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @ManyToOne(() => User, user => user.inventory)
    owner: User;
    @Column({ nullable: true})
    ownerId: string; // need to add the foreign key as a column to enhance the search efficiency
    @ManyToOne(() => Book, book => book.instances)
    book: Book;
    @Column({nullable: true})
    bookId: string;
    @CreateDateColumn()
    createdDate: Date;
    @Column({
        type: "enum",
        enum: BookVisibility,
        default: BookVisibility.PUBLIC
    })
    visibility: BookVisibility;
    @Column({
        type: "enum",
        enum: BookStatus,
        default: BookStatus.AVAILABLE
    })
    status: BookStatus;
}

export interface InventoryItemParam {
    visibility?: BookVisibility;
    status?: BookStatus;
}

@EntityRepository(InventoryItem)
export class InventoryRepository extends Repository<InventoryItem> {

}