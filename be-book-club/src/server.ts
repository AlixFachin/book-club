import express, {Request, Response} from "express";

// Configurations and .env files
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../../.env") } );

const app = express();
function setupRoutes(): void {
    
    app.get('/', (req: Request, res: Response) => {
        res.send("Well done!");
    })
}

const PORT = process.env.PORT || 1111;
setupRoutes();

app.listen(process.env.PORT, () => {
    console.log(`Application listening on port ${PORT}`)
} )