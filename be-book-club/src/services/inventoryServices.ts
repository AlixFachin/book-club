import { InventoryItem, User,  Book, InventoryItemParam } from "../Entities"
import { EntityManager, getConnection, getManager } from "typeorm"

export class InventoryServices {

    private entityManager: EntityManager;

    constructor() {
        this.entityManager = getConnection().manager;
    }

    public getInventory = async (userId:string): Promise<InventoryItem[] | undefined> =>  {
        try {
            const tgtUser =  await this.entityManager.findOne(User, userId, { relations: ["inventory"]  } );
            if (tgtUser) {
                return tgtUser.inventory || [] ;
            }
            return undefined;
        } catch(err) {
            return undefined;
        }   

    };

    public addBookToInventory = async (userId: string, bookId: string, properties?: InventoryItemParam ) : Promise<InventoryItem|undefined> => {
        try {
            const tgtBook = await this.entityManager.findOne(Book, bookId);
            const tgtUser = await this.entityManager.findOne(User, userId);
            if (tgtBook && tgtUser) {
                const newInventory = this.entityManager.create(InventoryItem, properties);
                newInventory.owner = tgtUser;
                newInventory.book = tgtBook;
                console.log(`Saving new Inventory for user ID ${tgtUser.id} and book ${tgtBook.id}`);
                const res = await this.entityManager.save(newInventory);
                if (res) {
                    console.log(JSON.stringify(res));
                    return res;
                }
            }
            return undefined;
        } catch(err) {
            return undefined;
        }
    };

    public removeFromInventory = async (userId: string, bookId: string, properties: InventoryItemParam ) : Promise<InventoryItem|undefined> => {
        // To do
        return undefined;
    };

    public editInventory = async (inventoryItemId: string, properties: InventoryItemParam) : Promise<InventoryItem|undefined> => {
        // To do
        return undefined;
    };


}