import "reflect-metadata";
import {  Connection, createConnection, getConnectionOptions, ConnectionOptions, getConnection } from "typeorm";
import { Book } from "./Entities";

type writeableConnectionOptions = { -readonly [ P in keyof ConnectionOptions ]: ConnectionOptions[P ] };

interface SeedData {
    booksList: Partial<Book>[],
}

export async function getDBConnection(testMode?: boolean) : Promise<Connection> {
    const connectionOptions = await getConnectionOptions();
    const additionalConnectionOptions: Partial<writeableConnectionOptions> = {};
    if (testMode) {
        additionalConnectionOptions.database = "testjapanbookclub";
        additionalConnectionOptions.dropSchema = true;
        additionalConnectionOptions.synchronize = true;
    }
    additionalConnectionOptions.entities = [Book];

    Object.assign(connectionOptions, additionalConnectionOptions );
    return await createConnection(connectionOptions);
}

export async function seedDBWithData(data: SeedData) {

    const bookRepo = getConnection().getRepository(Book);

    await bookRepo.clear();
    for (let bookData of data.booksList) {
        let newBook = bookRepo.create(bookData);
        await bookRepo.save(newBook);
    }

}



