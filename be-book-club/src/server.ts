import express, {Application, json, Request, Response} from "express";

// Configurations and .env files
import { config } from "dotenv";
import { resolve } from "path";
import { BookController } from "./controllers/bookController";
import { UserController } from "./controllers/userController";
import { Server } from "http";
import { InventoryController } from "./controllers/inventoryController";


class App {

    private readonly PORT_DEFAULT = 1111;
    public readonly app: Application;
    private expressServer : Server;
    public readonly port: number;
    private bookController: BookController;
    private userController: UserController;
    private inventoryController: InventoryController;

    constructor() {
        config({ path: resolve(__dirname, "../../.env") } );
        this.app = express();        
        this.setupRoutes();
        this.port = Number(process.env.PORT || this.PORT_DEFAULT);

        // Setup Middleware
        this.app.use(express.json());

    }
    
    private setupRoutes(): void {
        this.app.get('/', (req: Request, res: Response) => {
            res.send("Welcome to the homepage...");
        })
        // REST API Endpoints
        this.bookController = new BookController();
        this.app.use('/api/v1/books/', this.bookController.router);
        this.userController = new UserController();
        this.app.use('/api/v1/users/', this.userController.router);
        this.inventoryController = new InventoryController();
        this.app.use('/api/v1/', this.inventoryController.router);
    }

    public start(): void {
        this.expressServer = this.app.listen(this.port, () => {
            console.log(`Application listening on port ${this.port}`)
        } )
    }

    public stop(): void {
        if (this.expressServer) {
            this.expressServer.close( () => {
                console.log("Gracefully stopping listener server...")
            })
        }
    }

}

export function getDefaultApp() {
    return new App();
}

export default App;


