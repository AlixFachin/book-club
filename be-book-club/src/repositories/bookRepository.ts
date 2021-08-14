import { EntityRepository, Repository } from "typeorm";
import { Book } from "../dbentities";

@EntityRepository(Book)
export class BookRepository extends Repository<Book> {

}
