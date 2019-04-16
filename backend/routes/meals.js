const uuid = require('uuid');
const express = require('express');
const router = express.Router();
const Database = require('../database');
const utils = require('../utils');
const session = require('../ezsessions');

router.get('/fullinfo', (req, res) => {
    var db = Database.get();
    res.status(200).send({
        menu: db.get("menu").value(),
        tables: db.get("tables").value(),
        orders: db.get("orders").value()
    });
});

router.get('/menu', (req, res) => {
    res.status(200).send(Database.get().get("menu").value());
});

router.get('/orders', (req, res) => {
    res.status(200).send(Database.get().get("orders").value());
});

router.post('/order', (req, res) => {
    session.verifyCookie(req, res, (req, res) => {
        if (req.user.role != "admin") return res.status(403).send({ err: "Missing permissions" });
        Database.addOrder(req.body.table, req.body.seat, req.body.mealId, req.body.size, (err, order) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send(order);
        });
    });
});

router.delete('/order/:id', (req, res) => {
    session.verifyCookie(req, res, (req, res) => {
        if (req.user.role != "admin") return res.status(403).send({ err: "Missing permissions" });
        Database.deleteOrder(req.params.id, (err, order) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send(order);
        });
    });
});

router.put('/order/:id/state/:value', (req, res) => {
    session.verifyCookie(req, res, (req, res) => {
        if (req.user.role != "admin") return res.status(403).send({ err: "Missing permissions" });
        Database.setOrderState(req.params.id, parseInt(req.params.value), (err, order) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send(order);
        });
    });
});

module.exports = router;