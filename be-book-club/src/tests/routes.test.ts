import { getDBConnection, seedDBWithData} from "../db";
import { Connection, getConnection } from "typeorm"
import App from "../server";

import "mocha";
import chai from "chai";
import chaiHttp from "chai-http";

import data from "./testdata.json";
import { User, Book, InventoryItem, BookVisibility, BookStatus } from "../Entities";

chai.use(chaiHttp);
const expect = chai.expect;

describe('Routes API Test', async () => {
    let DBConnection: Connection;
    let server : App; 

    before(async () => {
        DBConnection = getConnection();
        if (!DBConnection) {
            DBConnection = await getDBConnection(true);
        }
        server = new App();
        server.start();

        await seedDBWithData(data);
    })

    after(async () => {
        server.stop();
    });

   describe("Book Entity Endpoints", () => {

        it("Should have a GET access point for all", async () => {
            const res = await chai.request(server.app).get("/api/v1/books");
            expect(res).to.have.status(200);
            const allBooks = res.body;
            expect(allBooks).to.be.an('array');
            expect(allBooks.length).to.equal(2);
            expect(allBooks[0].title).to.equal('Sherlock Holmes');
            expect(allBooks[1].title).to.equal('The Order of Time');
        });

        it("Should have a GET access point for ONE resource", async() => {
            let res = await chai.request(server.app).get("/api/v1/books");
            const allBooks = res.body;
            const firstBook = allBooks[0];

            // First case - everything goes well
            res = await chai.request(server.app).get(`/api/v1/books/${firstBook.id}`);
            expect(res).to.have.status(200);
            const returnedBook = res.body;
            expect(returnedBook.id).to.be.not.null;
            expect(returnedBook.id).to.equal(firstBook.id);

            // Error catch
            res = await chai.request(server.app).get(`/api/v1/books/gluglu1234`);
            expect(res).to.have.status(404);

        });

        it("Should have a POST access point", async () => {

            let res = await chai.request(server.app)
                .post("/api/v1/books")
                .send({
                    "title":"Norse Mythology",
                    "language":"en",
                    "tags":"fiction, historical",
                    "genre":"fiction",
                    "memo":"Collection of Northen European mythological tales"
                } );
            expect(res).to.have.status(201);
            let { id, title } = res.body;
            expect(id).to.be.not.null;
            expect(title).to.equal('Norse Mythology');

            // Error catching?
            res = await chai.request(server.app)
                .post("/api/v1/books")
                .send({});
            expect(res).to.have.status(400);

        });

        it ("Should have a PATCH access point", async () => {
            let res = await chai.request(server.app).get("/api/v1/books");
            let allBooks = res.body;
            let firstBook = allBooks[0];
            
            res = await chai.request(server.app).patch(`/api/v1/books/${firstBook.id}`).send({
                    "title":"Norse!",
                });
            
            expect(res).to.have.status(201);
            
            res = await chai.request(server.app)
                .get(`/api/v1/books/${firstBook.id}`);
            
            expect(res.body.title).to.equal("Norse!");
            
        })

   })

});

describe('Profiles/Users API Test', async () => {
    let DBConnection: Connection;
    let server : App; 

    
    before(async () => {
        DBConnection = getConnection();
        if (!DBConnection) {
            DBConnection = await getDBConnection(true);
        }   

        await seedDBWithData(data);
        server = new App();
        server.start();

    });

    after(async () => {
        if (server) {
            server.stop();
        }
    })

    it("Should support GET ALL functions", async () => {
        const res = await chai.request(server.app).get("/api/v1/users");
        expect(res).to.have.status(200);
        const allUsers = res.body;
        expect(allUsers).to.be.an('array');
        expect(allUsers.length).to.equal(2);
        expect(allUsers[0].fullName).to.equal('John Doe');
        expect(allUsers[1].fullName).to.equal('Roberto Tanaka');
    });

    it("Should support GET ONE function", async () => {
        let res = await chai.request(server.app).get("/api/v1/users");
        const allUsers = res.body;
        const firstUser = allUsers[0];

        res = await chai.request(server.app).get(`/api/v1/users/${firstUser.id}`);
        expect(res).to.have.status(200);
        const resUser = res.body;
        expect(resUser).to.not.be.undefined;
        expect(resUser.id).to.equal(firstUser.id);
        expect(resUser.fullName).to.equal(firstUser.fullName);

    });

    it("Should support CREATE one user", async () => {
        let res = await chai.request(server.app)
            .post(`/api/v1/users`)
            .send({
                fullName: "Luke Skywalker",
                postCode: "123-4567",
                country: "Japan",
                language: "en",
            });
        expect(res).to.not.be.undefined;
        expect(res).to.have.status(201);
        let { fullName, postCode } = res.body;
        expect(fullName).to.equal("Luke Skywalker");
        expect(postCode).to.equal("123-4567");

        res = await chai.request(server.app).get('/api/v1/users');
        expect(res.body.length).to.equal(3);

        res = await chai.request(server.app).post('/api/v1/users').send({});
        expect(res).to.have.status(400);

    });

    it("Should be able to DELETE one user", async () => {
        let res = await chai.request(server.app).get('/api/v1/users');
        const allUsers = res.body;
        let nrUsers = allUsers.length;
        let lastUser = allUsers[nrUsers-1];
        res = await chai.request(server.app)
            .delete(`/api/v1/users/${lastUser.id}`);
        expect(res).to.have.status(201);
        expect(res.body.id).to.equal(lastUser.id);
        res = await chai.request(server.app).get('/api/v1/users');
        expect(res.body.length).to.equal(nrUsers - 1);

    });


});

describe('Inventory Routes Test', async () => {
    let DBConnection: Connection;
    let server : App; 
    let allUsers : User[];
    let allBooks : Book[];

    
    before(async () => {
        DBConnection = getConnection();
        if (!DBConnection) {
            DBConnection = await getDBConnection(true);
        }   

        await seedDBWithData(data);
        server = new App();
        server.start();

        let res = await chai.request(server.app).get('/api/v1/users');
        allUsers = res.body;
        res = await chai.request(server.app).get('/api/v1/books');
        allBooks = res.body;

    });

    it("should have a GET inventory route", async () => {
        const firstUser = allUsers[0];

        let res = await chai.request(server.app).get(`/api/v1/users/${firstUser.id}/books`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(0);
    });

    it("should have a CREATE inventory route", async () => {
        const firstUser = allUsers[0];
        const firstBook = allBooks[0];

        let res = await chai.request(server.app)
            .post(`/api/v1/users/${firstUser.id}/books/${firstBook.id}`)
            .send({ visibility: BookVisibility.PUBLIC, status: BookStatus.AVAILABLE } );
        expect(res).to.have.status(201);
        expect(res.body.id).to.not.be.undefined;
        expect(res.body.visibility).to.equal(BookVisibility.PUBLIC);
        expect(res.body.status).to.equal(BookStatus.AVAILABLE);
        expect(res.body.owner.id).to.equal(firstUser.id);
        expect(res.body.book.id).to.equal(firstBook.id);

    });


});