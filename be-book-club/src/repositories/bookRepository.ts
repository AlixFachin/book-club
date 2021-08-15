import { EntityRepository, Repository } from "typeorm";
import { Book } from "../entitites/BookEntity";

@EntityRepository(Book)
export class BookRepository extends Repository<Book> {

}
