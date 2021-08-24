
import { Book, BookStatus, BookVisibility, User } from "../Entities";
import { getDBConnection, seedDBWithData } from "../db";

import { describe } from "mocha"
import { expect } from "chai"
import { Connection, getConnection } from "typeorm"

import { BookServices } from "../services/bookServices";
import { UserServices } from "../services/userServices";
import { InventoryServices } from "../services/inventoryServices";

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

    });

});

describe("Users CRUD Tests", async () => {
    let DBConnection : Connection; 
    let firstUser : User;

    before(async () => {
        DBConnection = getConnection();
        if (!DBConnection) {
            DBConnection = await getDBConnection(true);
        }
    });

    it("should be able to perform CRUD on Users", async () => {
        const userServices = new UserServices();
        expect(userServices.getOne).not.to.be.undefined;

        const users = await userServices.getAll();
        expect(users).to.be.an('array');
        expect(users.length).to.equal(2);

        let firstUser = users[0];
        
        // Get One
        let queriedUser = await userServices.getOne(firstUser.id);
        expect(queriedUser).not.to.be.undefined;
        expect(queriedUser?.id).to.equal(firstUser.id);

        // Modify One
        const newUser = await userServices.update(firstUser.id, { postCode: "123-456" });
        expect(newUser).not.to.be.undefined;
        expect(newUser?.id).to.equal(firstUser.id);
        queriedUser = await userServices.getOne(firstUser.id);
        expect(queriedUser?.postCode).to.equal("123-456");
       
        // Delete One
        const deleteResult = await userServices.delete(firstUser.id);
        expect(deleteResult).not.to.be.undefined;
        expect(deleteResult?.id).to.equal(firstUser.id);
        const updatedAllUserList = await userServices.getAll();
        expect(updatedAllUserList.length).to.equal(1);

    });

});

describe("Inventory CRUD Tests", async () => {
    let DBConnection: Connection;
    let bookServices: BookServices;
    let userServices: UserServices;
    let inventoryServices: InventoryServices;
    let allBooks : Book[];
    let allUsers : User[];

    before(async () => {
        DBConnection = getConnection();
        if (!DBConnection) {
            DBConnection = await getDBConnection(true);
        }
        
        bookServices = new BookServices();
        userServices = new UserServices();
        inventoryServices = new InventoryServices();
    
        allBooks = await bookServices.getAll();
        allUsers = await userServices.getAll();
    });

    it("should have a Inventory Setter", async () => {

        const initialInventory = await inventoryServices.getInventory(allUsers[0].id);
        expect(initialInventory).not.to.be.undefined;
        expect(initialInventory).to.be.an('array');
        expect(initialInventory?.length).to.equal(0);

        const resInsert = await inventoryServices.addBookToInventory(
                allUsers[0].id, 
                allBooks[0].id, 
                { 
                    visibility: BookVisibility.PUBLIC, 
                    status: BookStatus.AVAILABLE 
                }
            );
        expect(resInsert).not.to.be.undefined;
        expect(resInsert?.book.id).to.equal(allBooks[0].id);
        expect(resInsert?.owner.id).to.equal(allUsers[0].id);
        
        const newInventory = await inventoryServices.getInventory(allUsers[0].id);
        expect(newInventory).to.be.an('array');
        expect(newInventory?.length).to.equal(1);

    })


})
