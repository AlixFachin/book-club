import "reflect-metadata";
import {  Connection, createConnection, getConnectionOptions  } from "typeorm";
import { entityList } from "./dbentities";

export async function getDBConnection() : Promise<Connection> {
    const connectionOptions = await getConnectionOptions();
    Object.assign(connectionOptions, { entities: entityList } );
    return await createConnection(connectionOptions);
}





