// bookController
// This file will be imported by the server.
// Contains routers and points to database interface

import express, { Router, Response, Request, NextFunction } from "express";
import { Book } from "../Entities";
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

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const allBooks = await this.bookServices.getAll();
            res.status(200).send(allBooks);
        } catch(err) {
            next(err);
        }
    }

    public getOne = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            const { bookId } = req.params;
            const queriedBook = await this.bookServices.getOne(bookId);
            if (!queriedBook) {
                res.status(404).end();
            } else {
                res.status(200).send(queriedBook);
            }
        } catch(err) {
            next(err);
        }
    }

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const bodyBook = req['body'] as Book;
            const newBook = await this.bookServices.create(bodyBook);
            if (newBook) {
                res.status(201).send(newBook);
            } else {
                res.status(400).end();
            }
        } catch(err) {
            next(err);
        }
    }

    public update = async (req: Request, res: Response, next: NextFunction) => {
        const { bookId } = req.params;
        const newBookDetails = req.body;
        console.log(`Controller trying to modify the record ${bookId} with details ${JSON.stringify(newBookDetails)}`)
        try {
            const updatedBook = await this.bookServices.update(bookId, newBookDetails);
            if (updatedBook) {
                res.status(201).send(updatedBook);
            } else {
                res.status(400).end();
            }
        } catch(err) {  
            res.status(500).end();
            next(err);
        }
    }

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        const { bookId } = req.params;
        try {
            const deletedBook = await this.bookServices.delete(bookId);
            if (deletedBook) {
                res.status(201).send(deletedBook);
            } else {
                res.status(400).end();
            }
        } catch(err) {  
            res.status(500);
            next(err);
        }
    }

    public routes() {
        this.router.get('/', this.getAll);
        this.router.post('/', this.create);
        this.router.get('/:bookId', this.getOne);
        this.router.patch('/:bookId', this.update);
        this.router.delete('/:bookId', this.delete);
    }

}