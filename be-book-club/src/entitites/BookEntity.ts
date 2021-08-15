import "reflect-metadata";
import { Column,  Entity, PrimaryGeneratedColumn } from "typeorm";

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