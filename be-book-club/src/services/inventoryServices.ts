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
                const res = await this.entityManager.save(newInventory);
                if (res) {
                    return res;
                }
            }
            return undefined;
        } catch(err) {
            return undefined;
        }
    };

    public removeFromInventory = async (userId: string, bookId: string ) : Promise<InventoryItem|undefined> => {
        try {
            const inventory = await this.entityManager.find(InventoryItem, { ownerId: userId, bookId: bookId });
            if (inventory && inventory.length > 0) {
                const res = await this.entityManager.delete(InventoryItem, inventory[0].id);
                if (res.affected && res.affected > 0 ) {
                    return inventory[0];
                }
            }
            return undefined;
        } catch(err) {
            return undefined;
        }
        
    };

    public editInventory = async (userId: string, bookId: string, properties: InventoryItemParam) : Promise<InventoryItem|undefined> => {
        try {
            const inventoryItem = await this.entityManager.findOne(InventoryItem, { ownerId: userId, bookId: bookId });
            if (inventoryItem) {
                const res = await this.entityManager.update(InventoryItem, { id: inventoryItem.id }, properties);
                if (res && res.affected && res.affected > 0) {
                    return await this.entityManager.findOne(InventoryItem, { ownerId: userId, bookId: bookId });      
                }
            }
            return undefined;
        } catch(err) {
            return undefined;
        } 
    };


}