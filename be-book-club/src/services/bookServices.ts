// bookServices
// This class will define everything related with the 

import { DeleteResult, getConnection } from "typeorm";
import { BookRepository } from "../repositories/bookRepository";
import { Book } from "../entitites/BookEntity";

export class BookServices {
    private bookRepository: BookRepository;

    constructor() {
        this.bookRepository = getConnection().getCustomRepository(BookRepository);
    }

    public getAll = async () => {   
        const allBooks = await this.bookRepository.find()
        return allBooks;
    }

    public create = async (newBook: Book) : Promise<Book> => {
        const validatedNewBook = await this.bookRepository.save(newBook);
        return validatedNewBook;
    }

    public delete = async (deletedID: string) : Promise<DeleteResult> => {
        const delResult = await this.bookRepository.delete(deletedID);
        return delResult;
    }

}