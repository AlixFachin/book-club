
import { Book } from "./db"
import { getDBConnection } from "./db"

import { describe } from "mocha"
import { expect } from "chai"

describe('Basic DB features', async () => {

    it("should be able to connect to DB", async () => {
        const connection = await getDBConnection();
        expect(connection).to.not.be.undefined;

        let newBook = new Book();
        newBook.genre = "policier";
        newBook.language = "FR";
        newBook.memo = "stuff description";
        newBook.tags = "famous, classic";
        newBook.title = "Arsene Lupin";

        const savedBook = await connection.manager.save(newBook);
        expect(savedBook.id).to.equal(1);

    })

})



