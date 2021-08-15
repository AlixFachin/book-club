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

    public update = async (bookID: string, updateDetails: Partial<Book>) => {
        await this.bookRepository.update(bookID, updateDetails );
        return this.bookRepository.findOne(bookID);
    }

    public delete = async (deletedID: string) : Promise<Book | undefined> => {
        const toBeDeleted = await this.bookRepository.findOne(deletedID);
        if (toBeDeleted) {
            const delResult = await this.bookRepository.delete(deletedID);
            if (delResult.affected && delResult.affected === 1) {
                return toBeDeleted;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

}