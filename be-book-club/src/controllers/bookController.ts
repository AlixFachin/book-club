// bookController
// This file will be imported by the server.
// Contains routers and points to database interface

import { Router, Response, Request } from "express";

export class BookController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public getAll = async (req: Request, res: Response) => {
        res.send("get All books!");
    }

    public create = async (req: Request, res: Response) => {
        res.send("create a new book!");
    }

    public routes() {
        this.router.get('/', this.getAll);
        this.router.post('/', this.create);
    }

}