
import { Book } from "../entitites/BookEntity";
import { getDBConnection, seedDBWithData } from "../db";

import { describe } from "mocha"
import { expect } from "chai"
import { Connection } from "typeorm"

import { BookServices } from "../services/bookServices"

import data from "./testdata.json" ;

describe('Book CRUD Tests', async () => {
    let DBConnection : Connection;

    before(async () => {
        DBConnection = await getDBConnection(true);
    });

    it("should be able to connect to DB", async () => {
        expect(DBConnection).to.not.be.undefined;
    });
    
    it("should have the test seeding function ready", async () => {
        await seedDBWithData(data);

        const bookLibrary = await DBConnection.getRepository(Book).find()
        expect(bookLibrary.length).to.equal(2);

    });

    // TESTS
    // Can I get all the books?
    // Can I get one book with the bookID?
    // Can I add one book?
    // Can I delete one book?
    // Can I modify one book?

    it("should be able to do CRUD on books", async () => {

        const bookServices = new BookServices();
        expect(bookServices.getAll).not.to.be.undefined;

        // RECEIVING ALL BOOKS
        const allBooks = await bookServices.getAll();
        expect(allBooks).to.be.an("array");
        const initialLibLength = allBooks.length;

        // ADDING ONE BOOK
        const newBook = new Book();
        newBook.genre = "policier";
        newBook.language = "FR";
        newBook.memo = "stuff description";
        newBook.tags = "famous, classic";
        newBook.title = "Arsene Lupin";
        
        const validatedNewBook = await bookServices.create(newBook);
        expect(validatedNewBook).not.to.be.undefined;
        if (validatedNewBook){
            expect(validatedNewBook.id).not.to.be.undefined;
            expect(validatedNewBook.genre).to.equal(newBook.genre);
            expect(validatedNewBook.language).to.equal(newBook.language);
            expect(validatedNewBook.memo).to.equal(newBook.memo);
            expect(validatedNewBook.tags).to.equal(newBook.tags);
            expect(validatedNewBook.title).to.equal(newBook.title);
        } else {
            return;
        }

        // Checking the new length of library size
        let currentLibrarySize = (await bookServices.getAll()).length;
        expect(currentLibrarySize).to.equal(initialLibLength+1);

        // Modifying one object
        const modifiedBook = await bookServices.update(validatedNewBook.id, { genre: 'historic', title: 'Le Rouge et le Noir' })
        expect(modifiedBook).not.to.be.undefined;
        if (modifiedBook){
            expect(modifiedBook.id).to.equal(validatedNewBook.id);
            expect(modifiedBook.genre).to.equal('historic');
            expect(modifiedBook.title).to.equal('Le Rouge et le Noir');
        }

        // Deleting one object
        const deleteResult = await bookServices.delete(validatedNewBook.id);
        expect(deleteResult).not.to.be.undefined;
        // Checking that the library size (nr of books) is back to the original one
        currentLibrarySize = (await bookServices.getAll()).length;
        expect(currentLibrarySize).to.equal(initialLibLength);

    })


})



