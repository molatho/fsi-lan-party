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
});

router.post('/login', (req, res) => {
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
    session.verifyCookie(req, res, (req, res)=>{
        var user = req.user;
        session.destroyCookie(req,res, (req,res)=>{
            return res.status(200).send({
                msg: `Logged out ${user.name}`,
                user: {
                    name: user.name,
                    role: user.role
                }
            });
        });
    });
});

router.post('/new', (req, res) => {
    session.verifyCookie(req, res, (req, res)=>{
        if (req.user.role != "admin") return res.status(403).send({ err: "Missing permissions" });
        
        Database.addUser(req.body.username, req.body.password, req.body.role, (err, user) => {
            if (err) return res.status(400).send(err);
            res.status(200).send({ msg: `Created user ${req.body.username}` });
        });
    });
});

module.exports = router;