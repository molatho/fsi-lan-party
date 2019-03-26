const express = require('express');
const utils = require('../utils');
const Database = require('../database');
const router = express.Router();
const session = require('../ezsessions');

router.get('/status', (req, res) => {
    session.verifyCookie(req, res, (req, res)=>{
        return res.status(200).send({
            msg: `Logged in as ${req.user.name}`,
            user: {
                name: req.user.name,
                role: req.user.role
            }
        });
    });
    //res.status(400).send({ err: 'Not logged in' });
});

router.post('/login', (req, res) => {
    //if (req.session.user) return res.status(400).send({ err: 'Already logged in' });

    Database.checkLogin(req.body.username, req.body.password, (err, user) => {
        if (err) return res.status(400).send(err);
        session.generateCookie(req, res, user, (req, res)=>{
            res.status(200).send(
                {
                    msg: `Logged in as ${user.name}`,
                    user: {
                        name: user.name,
                        role: user.role
                    }
                }
            );
        });
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