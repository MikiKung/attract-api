const express = require('express');
const app = express();
const port = 3001;
const mongo = require("./db/mongo.js")

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port} EIEI`);
});