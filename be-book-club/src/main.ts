import express from "express";

// Configurations and .env files
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../../.env"})

// Database setup
import { createConnection } from "typeorm";
const connection = await createConnection();

const app = express();
app.get('/', (req, res) => {
    res.send("Well done!");
})

const PORT = process.env.PORT || 1111;

app.listen(process.env.PORT, () => {
    console.log(`Application listening on port ${PORT}`)
} )