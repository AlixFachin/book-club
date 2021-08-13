import "reflect-metadata";
import { Column, Connection, Entity, PrimaryGeneratedColumn, createConnection, getConnectionOptions  } from "typeorm";

export async function getDBConnection() : Promise<Connection> {
    const connectionOptions = await getConnectionOptions();
    Object.assign(connectionOptions, { entities: [Book] } );
    return await createConnection(connectionOptions);
}

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



