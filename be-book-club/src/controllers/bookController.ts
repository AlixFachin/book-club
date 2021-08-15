// bookController
// This file will be imported by the server.
// Contains routers and points to database interface

import express, { Router, Response, Request } from "express";
import { Book } from "../entitites/BookEntity";
import { BookServices } from "../services/bookServices";

export class BookController {
    public router: Router;
    public bookServices: BookServices;

    constructor() {
        this.router = Router();
        this.router.use(express.json());
        this.bookServices = new BookServices();
        this.routes();
    }

    public getAll = async (req: Request, res: Response) => {
        const allBooks = await this.bookServices.getAll();
        res.status(200).send(allBooks);
    }

    public create = async (req: Request, res: Response) => {
        const bodyBook = req['body'] as Book;
        const newBook = await this.bookServices.create(bodyBook);
        if (newBook) {
            res.send(newBook);
        } else {
            res.status(400).end();
        }
    }

    public update = async (req: Request, res: Response) => {
        res.send("Updated the latest book!");
    }

    public delete = async (req: Request, res: Response) => {
        res.send("deleting the corresponding ID");
    }

    public routes() {
        this.router.get('/', this.getAll);
        this.router.post('/', this.create);
        this.router.patch('/:id', this.update);
        this.router.delete('/:id', this.delete);
    }

}