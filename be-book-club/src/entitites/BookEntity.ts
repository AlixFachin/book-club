import "reflect-metadata";
import { Column,  Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Book {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    title: string;
    @Column()
    tags: string;
    @Column()
    genre: string;
    @Column()
    language: string;
    @Column()
    memo: string;
}