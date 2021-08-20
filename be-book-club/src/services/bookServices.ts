// bookServices
// This class will define everything related with the 

import { getConnection } from "typeorm";
import { Book, BookRepository } from "../Entities";

export class BookServices {
    private bookRepository: BookRepository;

    constructor() {
        this.bookRepository = getConnection().getCustomRepository(BookRepository);
    }

    public getAll = async () => {   
        const allBooks = await this.bookRepository.find()
        return allBooks;
    }

    public getOne = async (bookId: string) => {
        try{
            const requestedBook = await this.bookRepository.findOne(bookId);
            return requestedBook;
        } catch(err) {
            return undefined
        }
    }

    public create = async (bookDetails: Omit<Book, "id">) : Promise<Book | undefined> => {
        try {
            let newBook = new Book();
            newBook = { ...newBook, ...bookDetails};
            return await this.bookRepository.save(newBook);                        
        } catch (error) {
            // TODO => Catch the error message somewhere somehow
            return undefined;
        }
    }

    public update = async (bookID: string, updateDetails: Partial<Book>) => {
        console.log(`Trying to update the book ${bookID} with details ${JSON.stringify(updateDetails)}`);
        try { 
            await this.bookRepository.update(bookID, updateDetails);
            const modifiedBook  = await this.bookRepository.findOne(bookID);
            return modifiedBook;
        } catch (err) {
            return undefined;
        }
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