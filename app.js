const express = require('express');
const app = express();
const fs = require('node:fs');
const readline = require("readline")
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const port = 8080;

var users = {};

app.use(express.static('public', { "maxAge": 1000 }));

app.get("/signup/usernameInUse/:name", (req, res) => {
    res.json([users.keys().indexOf(req.params.name) != -1]);
});

rl.on("line", (input) => {
    if (input != "exit" && input != "save") return

    fs.writeFileSync('./data.json', JSON.stringify(users), 'utf8');
    if (input == "save") return

    server.close();
    process.exit(0);
});

fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log(data);
    users = JSON.parse(data);
});

var server = app.listen(port);