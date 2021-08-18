import { Book } from "../entitites/BookEntity";
import { getDBConnection, seedDBWithData} from "../db";
import { Connection, getConnection } from "typeorm"
import App from "../server";

import "mocha";
import chai from "chai";
import chaiHttp from "chai-http";

import data from "./testdata.json";

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

        it("Should have a PUT access point", async () => {

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

        xit ("Should have a PATCH access point", async () => {
            let res = await chai.request(server.app).get("/api/v1/books");
            let allBooks = res.body;
            let firstBook = allBooks[0];
            
            // res = await chai.request(server.app)
            //     .patch(`/api/v1/books/${firstBook.id}`)
            //     .send({
            //         "title":"Norse!",
            //     })
            
        })

   })

})