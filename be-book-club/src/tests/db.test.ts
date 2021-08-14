
import { Book } from "../dbentities";
import { getDBConnection } from "../db";

import { describe } from "mocha"
import { expect } from "chai"
import { Connection } from "typeorm"

import { BookServices } from "../services/bookServices"

describe('Basic DB features', async () => {
    let DBConnection : Connection;

    before(async () => {
        DBConnection = await getDBConnection();
    });

    it("should be able to connect to DB", async () => {
        expect(DBConnection).to.not.be.undefined;
    });
    
    // TESTS
    // Can I get all the books?
    // Can I get one book with the bookID?
    // Can I add one book?
    // Can I delete one book?
    // Can I modify one book?
    
    it("should be able to retrieve all the books", async () => {

        const bookServices = new BookServices();
        expect(bookServices.getAll).not.to.be.undefined;

        const allBooks = await bookServices.getAll();
        expect(allBooks).to.be.an("array");


        const newBook = new Book();
        newBook.genre = "policier";
        newBook.language = "FR";
        newBook.memo = "stuff description";
        newBook.tags = "famous, classic";
        newBook.title = "Arsene Lupin";
        
        const validatedNewBook = await bookServices.create(newBook);
        expect(validatedNewBook.id).not.to.be.undefined;
        expect(validatedNewBook.genre).to.equal(newBook.genre);
        expect(validatedNewBook.language).to.equal(newBook.language);
        expect(validatedNewBook.memo).to.equal(newBook.memo);
        expect(validatedNewBook.tags).to.equal(newBook.tags);
        expect(validatedNewBook.title).to.equal(newBook.title);

    })




})



