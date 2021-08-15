import { Book } from "../entitites/BookEntity";
import { getDBConnection } from "../db";
import { Connection } from "typeorm"

import { describe } from "mocha"
import { expect } from "chai"

describe('Routes API Test', async () => {
    let DBConnection: Connection;

    before(async () => {
        DBConnection = await getDBConnection(true);
    })

    it('Should return the list of all packages', async () => {

    })


})