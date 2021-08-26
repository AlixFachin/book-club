import { Router, Response, Request, NextFunction,  json } from "express";
import { InventoryServices } from "../services/inventoryServices";


export class InventoryController {
    public router: Router;
    public inventoryServices: InventoryServices;

    constructor() {
        this.router = Router();
        this.router.use(json());
        this.inventoryServices = new InventoryServices();
        this.registerRoutes();
    }

    public registerRoutes = () => {
        this.router.get('/users/:userId/books', this.getAll);
        this.router.post('/users/:userId/books/:bookId', this.addBookToInventory);
        this.router.patch('/users/:userId/books/:bookId', this.editInventoryItem);
        this.router.delete('/users/:userId/books/:bookId', this.deleteInventoryItem);
    }

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params;
        try {
            const userInventory = await this.inventoryServices.getInventory(userId);
            if (userInventory) {
                res.status(200).send(userInventory);
            } else {
                res.status(400).end();
            }

        } catch(err) {
            res.status(500);
            next(err);
        }
    }

    public addBookToInventory = async (req: Request, res: Response, next: NextFunction) => {
        const { bookId, userId } = req.params;
        const inventoryParameters = req.body;
        try {
            const newInventoryItem = await this.inventoryServices.addBookToInventory(userId, bookId, inventoryParameters);
            if (newInventoryItem) {
                res.status(201).send(newInventoryItem);
            } else {
                res.status(400).end();
            }
        } catch (err) {
            res.status(500);
            next(err);
        }
    }

    public editInventoryItem = async (req: Request, res: Response, next: NextFunction) => {
        const { bookId, userId } = req.params;
        const updateParameters = req.body;
        try {
            const updatedInventoryItem = await this.inventoryServices.editInventory(userId, bookId, updateParameters);
            if (updatedInventoryItem) {
                res.status(201).send(updatedInventoryItem);
            } else {
                res.status(400).end();
            }
        } catch(err) {
            res.status(500);
            next(err);
        }
    } 

    public deleteInventoryItem = async(req: Request, res: Response, next: NextFunction) => {
        const { bookId, userId } = req.params;
        try {
            const deletedInventoryItem = await this.inventoryServices.removeFromInventory(userId, bookId);
            if (deletedInventoryItem) {
                res.status(200).send(deletedInventoryItem);
            } else {
                res.status(400).end();
            }
        } catch(err) {
            res.status(500);
            next(err);
        }
    }

}