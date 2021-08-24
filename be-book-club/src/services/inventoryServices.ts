import { Inventory, InventoryRepository } from "../Entities"
import { getConnection } from "typeorm"

export class InventoryServices {

    private inventoryRepository: InventoryRepository;

    constructor() {
        this.inventoryRepository = getConnection().getRepository(Inventory)
    }

    public getAll = async () => {
        
    }

}