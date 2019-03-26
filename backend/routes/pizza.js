const uuid = require('uuid');
const express = require('express');
const router = express.Router();
const Database = require('../database');
const utils = require('../utils');

router.get('/menu', (req, res)=>{
    res.status(200).send(Database.get().get("menu").value());
});

router.get('/orders/status', (req, res) =>{
    res.status(200).send(Database.get().get("orders").value());
});

router.post('/order', (req, res) => {
    if (!req.session.user || req.session.user.role != "admin") return res.status(403).send({err: "Nah."});
    Database.addOrder(req.body.table, req.body.seat, req.body.mealId, req.body.size, (err, order)=>{
        if (err) res.status(400).send(err);
        return res.status(200).send(order);
    });
});

router.delete('/order/:id', (req, res)=>{
    if (!req.session.user || req.session.user.role != "admin") return res.status(403).send({err: "Nah."});
    Database.deleteOrder(req.params.orderid, (err, order)=>{
        if (err) res.status(400).send(err);
        return res.status(200).send(order);
    });
});

router.put('/order/:id/delivered/:value', (req, res)=>{
    if (!req.session.user || req.session.user.role != "admin") return res.status(403).send({err: "Nah."});
    Database.setOrderDelivered(req.body.orderid, req.params.value, (err, order) => {
        if (err) res.status(400).send(err);
        return res.send(200).send(order);
    });
});

module.exports = router;
