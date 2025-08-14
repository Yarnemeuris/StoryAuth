const express = require('express');
const app = express();
const fs = require('fs');
const readline = require("readline")
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const bcrypt = require('bcrypt');
const saltRounds = 10;
const port = 8080;

var users = {};

app.use(express.static('public', { "maxAge": 1000 }));
app.use(express.json());

function usernameInUse(name) {
    return Object.keys(users).indexOf(name) != -1
}

app.get("/signup/usernameInUse/:name", (req, res) => {
    res.json([usernameInUse(req.params.name)]);
});

app.post("/signup", async (req, res) => {
    if (usernameInUse(req.body.name)) {
        res.status(409).end();
        return;
    }

    const hash = await bcrypt.hash(req.body.story, saltRounds);
    users[req.body.username] = { hash: hash, panelInfo: req.body.panelInfo };
    res.status(201).end();
});

app.get("/logIn/story/:name", (req, res) => {
    if (usernameInUse(req.params.name)) {
        res.status(500).end();
        return;
    }

    res.status(200).json([users[req.params.name].panelInfo]);
})

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