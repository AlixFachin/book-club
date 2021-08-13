import express from "express";

const PORT = 6666;

const app = express();
app.get('/', (req, res) => {
    res.send("Well done!");
})

app.listen(PORT, () => {
    console.log(`Application listening on port ${PORT}`)
} )