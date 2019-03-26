const express = require('express');
const utils = require('../utils');
const Database = require('../database');
const router = express.Router();

router.get('/status', (req, res) => {
    if (req.session.user) return res.status(200).send({ msg: 'Logged in' });
    res.status(400).send({ err: 'Not logged in' });
});

router.post('/login', (req, res) => {
    if (req.session.user) return res.status(400).send({ err: 'Already logged in' });

    Database.checkLogin(req.body.username, req.body.password, (err, user) => {
        if (err) return res.status(400).send(err);
        req.session.user = user;
        res.status(200).send({ msg: `Logged in as ${user[0].username}` });
    });
});

router.post('/logout', (req, res) => {
    if (!req.session.user) return res.status(400).send({ err: 'Not logged in' });

    req.session.user = undefined;
    res.status(200).send({ msg: `Logged out` });
});

router.post('/new', (req, res) => {
    if (!req.session.user) return res.status(400).send({ err: 'Not logged in' });
    if (req.session.user.role != "admin") return res.status(403).send({ err: "Missing permissions" });

    Database.addUser(req.body.username, req.body.password, req.body.role, (err, user) => {
        if (err) return res.status(400).send(err);
        res.status(200).send({ msg: `Created user ${req.body.username}` });
    });

});

module.exports = router;