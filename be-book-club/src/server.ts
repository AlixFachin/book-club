import express, {Application, json, Request, Response} from "express";

// Configurations and .env files
import { config } from "dotenv";
import { resolve } from "path";
import { BookController } from "./controllers/bookController";


class App {

    private readonly PORT_DEFAULT = 1111;
    public readonly app: Application;
    public readonly port: number;
    private bookController: BookController;

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
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`Application listening on port ${this.port}`)
        } )
    }
}

export function getDefaultApp() {
    return new App();
}

export default App;


