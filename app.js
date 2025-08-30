const express = require('express');
const app = express();
const session = require('express-session');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const bcrypt = require('bcrypt');
const { execSync } = require('child_process');
const saltRounds = 10;
const port = 80;

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
    if (usernameInUse(req.body.username)) {
        res.status(409).end();
        return;
    }

    const hash = await bcrypt.hash(req.body.story, saltRounds);
    users[req.body.username] = { hash, panelInfo: req.body.panelInfo, story: [{ color: "rgb(255, 255, 255)", chars: [] }, { color: "rgb(255, 255, 255)", chars: [] }, { color: "rgb(255, 255, 255)", chars: [] }] };

    req.session.user = { username: req.body.username }
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

    res.status(200).end()
})

app.get('/logIn', (req, res) => {
    res.redirect(301, '/StoryAuth/?view=logIn')
})

app.get('/signUp', (req, res) => {
    res.redirect(301, '/StoryAuth/?view=signUp')
})

app.get('/account', (req, res) => {
    if (req.session.user == undefined) {
        res.redirect('/StoryAuth/')
        return
    }

    res.redirect('/StoryAuth/?view=account')
})

rl.on("line", (input) => {
    if (input != "exit" && input != "save") return

    saveData()
    if (input == "save") return

    server.close();
    process.exit(0);
});

function saveData() {
    fs.writeFileSync('./data.json', JSON.stringify({ sessionSecret, users }), 'utf8');
}

function loadData() {
    if (fs.existsSync("./data.json")) {
        const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
        users = data.users;
        sessionSecret = data.sessionSecret
    } else {
        console.log("No data file found. Generating new sessionSecret and user table.")
        sessionSecret = execSync("openssl rand -base64 32").toString();
    }
}

setInterval(saveData, 3600000);

var server = app.listen(port);