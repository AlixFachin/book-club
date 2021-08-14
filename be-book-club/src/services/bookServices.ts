// bookServices
// This class will define everything related with the 

import { getConnection } from "typeorm";
import { BookRepository } from "../repositories/bookRepository";
import { Book } from "../dbentities";

export class BookServices {
    private bookRepository: BookRepository;

    constructor() {
        this.bookRepository = getConnection().getCustomRepository(BookRepository);
    }

    public getAll = async () => {
        const allBooks = await this.bookRepository.find()
        return allBooks;
    }

    public create = async (newBook: Book) => {
        const validatedNewBook = await this.bookRepository.save(newBook);
        return validatedNewBook;
    }

}