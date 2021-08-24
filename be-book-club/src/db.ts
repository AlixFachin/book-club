import "reflect-metadata";
import {  Connection, createConnection, getConnectionOptions, ConnectionOptions, getConnection } from "typeorm";
import { Book, User, InventoryItem } from "./Entities";

type writeableConnectionOptions = { -readonly [ P in keyof ConnectionOptions ]: ConnectionOptions[P ] };

interface SeedData {
    booksList: Partial<Book>[],
    usersList: Partial<User>[],
}

export async function getDBConnection(testMode?: boolean) : Promise<Connection> {
    const connectionOptions = await getConnectionOptions();
    const additionalConnectionOptions: Partial<writeableConnectionOptions> = {};
    if (testMode) {
        additionalConnectionOptions.database = "testjapanbookclub";
        additionalConnectionOptions.dropSchema = true;
        additionalConnectionOptions.synchronize = true;
    }
    // CONNECTION OPTIONS -> Need to write the list of all the entities
    additionalConnectionOptions.entities = [Book, User, InventoryItem];

    Object.assign(connectionOptions, additionalConnectionOptions );
    return await createConnection(connectionOptions);
}

export async function seedDBWithData(data: SeedData) {

    const bookRepo = getConnection().getRepository(Book);
    const userRepo = getConnection().getRepository(User);
    const inventoryRepo = getConnection().getRepository(InventoryItem);

    await inventoryRepo.delete({}); // Deleting the inventory first because of foreign key constraints
    await bookRepo.delete({});
    await userRepo.delete({});
    for (let bookData of data.booksList) {
        let newBook = bookRepo.create(bookData);
        await bookRepo.save(newBook);
    }
    for (let userData of data.usersList) {
        let newUser = userRepo.create(userData);
        await userRepo.save(newUser);
    }
}




