const express = require('express');
const utils = require('../utils');
const Database = require('../database');
const router = express.Router();

router.get('/status', (req, res) => {
    if (req.session.user) {
        res.status(200).send('Logged in');
    } else {
        res.status(403).send('Not logged in');
    }
});

router.post('/login', (req, res) => {
    if (req.session.user) {
        return res.status(403).send('Already logged in');
    }
    var user = Database.get().get('users')
        .filter({ username: req.body.username, password: req.body.password })
        .take(1)
        .value();
    if (!user || !user.length) {
        return res.status(403).send('You shall not pass');
    }
    req.session.user = user[0];
    res.status(200).send(`Logged in as ${user[0].username}`);
});

router.post('/logout', (req, res) => {
    if (!req.session.user) {
        return res.status(403).send('You shall not pass');
    }
    req.session.user = undefined;
    res.status(200).send(`Logged out`);
});

/*router.post('/register', (req, res) => {
    if (req.session.user) {
        return res.status(403).send('Already logged in');
    }
    if (utils.isEmpty(req.body.username) || utils.isEmpty(req.body.password)) {
        return res.status(403).send('Invalid parameters');
    }
    var user = Database.get().get('users')
        .filter({ username: req.body.username })
        .take(1)
        .value();
    if (user && user.length > 0) {
        return res.status(403).send('User already registered');
    }
    user = {
        username: req.body.username,
        password: req.body.password,
        id: uuid.v1(),
        role: "user"
    };
    var user = Database.get().get('users').push(user).write();
    req.session.user = user;
    res.status(200).send(`Logged in as ${user[0].username}`);
});*/

module.exports = router;
