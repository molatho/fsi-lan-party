const express = require('express');
const utils = require('../utils');
const Database = require('../database');
const router = express.Router();

router.get('/status', (req, res) => {
    if (req.session.token) {
        res.status(200).send('Logged in');
    } else {
        res.status(400).send({ err: 'Not logged in' });
    }
});

router.post('/login', (req, res) => {
    if (req.session.token) {
        return res.status(400).send({ err: 'Already logged in' });
    }

    var user = Database.get().get('users')
        .filter({ username: req.body.username, token: req.body.token })
        .take(1)
        .value();
    if (!user || !user.length) {
        return res.status(400).send({ err: 'You shall not pass' });
    }
    req.session.token = user[0];
    res.status(200).send(`Logged in as ${user[0].username}`);
});

router.post('/logout', (req, res) => {
    if (!req.session.token) {
        return res.status(400).send({ err: 'You shall not pass' });
    }
    req.session.token = undefined;
    res.status(200).send(`Logged out`);
});

router.post('/register', (req, res) => {
    if (req.session.token) {
        return res.status(400).send({ err: 'Already logged in' });
    }
    if (utils.isEmpty(req.body.username) || utils.isEmpty(req.body.token)) {
        return res.status(400).send({ err: 'Invalid parameters' });
    }
    Database.registerUser(req.body.username, req.body.token, (err, user) => {
        if (err) {
            return res.status(400).send({ err: err });
        }

        req.session.token = user;
        res.status(200).send(user);
    });
});

module.exports = router;