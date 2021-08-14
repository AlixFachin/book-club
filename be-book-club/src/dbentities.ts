import "reflect-metadata";
import { Column,  Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;
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

export const entityList = [Book];