const express = require('express');
const app = express();
const session = require('express-session');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const bcrypt = require('bcrypt');
const saltRounds = 10;
const port = 8080;

var sessionSecret = ""
var users = {};

loadData();

app.use(express.static('public', { "maxAge": 1000 }));
app.use(express.json());
app.use(session({ secret: sessionSecret, resave: false, saveUninitialized: false }))

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
    users[req.body.username] = { hash, panelInfo: req.body.panelInfo, story: [] };

    req.session.user = { username: req.params.name }
    res.status(201).end();
});

app.get("/logIn/:name", (req, res) => {
    if (!usernameInUse(req.params.name)) {
        res.status(500).end();
        return;
    }

    res.status(200).json([users[req.params.name].panelInfo]);
})

app.post("/logIn/:name", async (req, res) => {
    if (!usernameInUse(req.params.name)) {
        res.status(409).end();
        return;
    }

    const hash = users[req.params.name].hash
    const rightStory = await bcrypt.compare(req.body.story, hash)

    if (!rightStory) {
        res.status(424).end();
        return
    }

    req.session.user = { username: req.params.name }
    res.status(200).end()
})

app.get('/loggedIn', (req, res) => {
    res.set('Cache-Control', 'private, max-age=600')
    res.status(200).send(req.session.user != undefined)
})

app.get('/account/story', (req, res) => {
    if (req.session.user == undefined) {
        res.status(401).end();
        return;
    }

    res.status(200).json(users[req.session.user.username].story)
})

app.put('/account/story', (req, res) => {
    if (req.session.user == undefined) {
        res.status(401).end();
        return;
    }

    users[req.session.user.username].story = req.body
    console.log(users[req.session.user.username].story)

    res.status(200).end()
})

app.get('/logIn', (req, res) => {
    res.redirect(301, '/?view=logIn')
})

app.get('/signUp', (req, res) => {
    res.redirect(301, '/?view=signUp')
})

app.get('/account', (req, res) => {
    if (req.session.user == undefined) {
        res.redirect('/')
        return
    }

    res.redirect('/?view=account')
})

rl.on("line", (input) => {
    if (input != "exit" && input != "save") return

    fs.writeFileSync('./data.json', JSON.stringify({ sessionSecret, users }), 'utf8');
    if (input == "save") return

    server.close();
    process.exit(0);
});

function loadData() {
    const data = fs.readFileSync('./data.json', 'utf8');

    console.log(data);
    const table = JSON.parse(data);
    users = table.users;
    sessionSecret = table.sessionSecret
}

var server = app.listen(port);