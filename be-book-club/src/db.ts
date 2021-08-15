import "reflect-metadata";
import {  Connection, createConnection, getConnectionOptions, ConnectionOptions, Entity, EntitySchema  } from "typeorm";
import { Book } from "./entitites/BookEntity";

type writeableConnectionOptions = { -readonly [ P in keyof ConnectionOptions ]: ConnectionOptions[P ] };

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





