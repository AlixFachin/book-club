import { Book } from "../entitites/BookEntity";
import { getDBConnection } from "../db";
import { Connection, getConnection } from "typeorm"
import App from "../server";

import "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import { doesNotMatch } from "assert/strict";

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
    })

   describe("Book Entity Endpoints", () => {

        it("Should have a GET access point", async () => {
            const res = await chai.request(server.app).get("/api/v1/books");
            expect(res).to.have.status(200);

        });

   })

})