const uuid = require('uuid');
const express = require('express');
const router = express.Router();
const Database = require('../database');
const utils = require('../utils');
const MAX = 3;

function getSanitizedOrders(ip) {
    return Database.get().get("pizza").get("orders").filter({ "ip": ip }).cloneDeep().value().map(o => {
        return {
            selection: o.selection,
            size: o.size,
            qty: o.qty,
            id: o.id
        }
    });
}

router.get('/status', (req, res) => {
    var pizza = Database.get().get('pizza').value();
    res.status(200).send(pizza.status);
});

router.get('/orders', (req, res) => {
    var pizzas = getSanitizedOrders(req.connection.remoteAddress);
    res.status(200).send(pizzas);
});

router.get('/admin/orders', (req, res) => {
    if (!req.session.user || req.session.user.role !== "admin") {
        return res.status(400).send({ err: "Ähm nein." });
    }
    res.status(200).send(Database.get().get("pizza").get("orders").value());
});

router.delete('/admin/orders', (req, res) => {
    if (!req.session.user || req.session.user.role !== "admin") {
        return res.status(400).send({ err: "Ähm nein." });
    }
    Database.get().get("pizza").set("orders", []).write();
    res.status(200).send(Database.get().get("pizza").value());
});

router.delete('/orders/:id', (req, res) => {
    var id = req.params.id;
    var ip = req.connection.remoteAddress;
    var orders = Database.get().get("pizza").get("orders").filter({ "ip": ip, "id": id }).value();

    if (!orders || orders.length == 0) {
        return res.status(400).send({ err: "Ungültige Bestellung." });
    }

    Database.get().get("pizza").get("orders").remove(orders[0]).write();
    res.send(getSanitizedOrders(ip));
});

router.post('/', (req, res) => {
    var item = {
        selection: req.body.selection,
        size: req.body.size,
        qty: req.body.qty,
        ip: req.connection.remoteAddress
    };

    if (utils.isEmpty(item.selection) || utils.isEmpty(item.size) || item.qty < 1) {
        return res.status(400).send({ err: "Ungültige Bestelldaten." });
    }

    var orders = Database.get().get("pizza").get("orders").filter({ "ip": item.ip }).value();
    var sum = 0;
    if (orders.length > 0) {
        sum = orders.reduce((total, value) => (parseInt(total) | 0) + (parseInt(value.qty) | 0), 0);
        console.log(sum);
        if (sum >= MAX) {
            return res.status(403).send(`Du hast bereits ${sum} Pizzen bestellt!`);
        }
    }
    if (sum + item.qty > MAX) {
        return res.status(403).send(`Du darfst maximal ${MAX} Pizzen bestellen!`);
    }

    item.id = uuid.v4();
    Database.get().get("pizza").get("orders").push(item).write();
    res.send(getSanitizedOrders(item.ip));
});

module.exports = router;
