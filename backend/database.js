const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const utils = require("./utils");
const uuid = require("uuid");

const STATES = {
    "New": 0,
    "Paid": 1,
    "Delivered": 2,
    0: "Neu",
    1: "Bezahlt",
    2: "Ausgeliefert",
    isValid: function(state) {
        return STATES[state] !== undefined  || (state >= STATES.New && state < STATES.Delivered);
    },
    toString: function(state) {
        if (!STATES.isValid(state)) return "INVALID";
        return STATES[state];
    }
}

var db;
const SEATS_PER_TABLE = 8;
const TABLE_NAMES = ["Alfa", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliett"];

class Database {
    static initialize(path) {
        db = low(new FileSync(path));
    }

    static get() {
        return db;
    }

    /**
     * Creates and populates tables and their tokens and makes sure that a working environment is established.
     *
     * @static
     * @memberof Database
     */
    static initializeTables() {
        var db = Database.get();
        var tables = db.get("tables").value();
        if (!tables) { tables = []; }

        for (var idx in TABLE_NAMES) {
            var table = tables.filter(x => x.name == TABLE_NAMES[idx]);
            if (table.length == 0) {
                console.log(`Adding table ${TABLE_NAMES[idx]}...`);
                tables.push({
                    "name": TABLE_NAMES[idx],
                    "seats": SEATS_PER_TABLE
                });
            }
        }

        db.set("tables", tables).write();
    }

    /**
     * Gets a user by its username
     *
     * @static
     * @param {*} username
     * @returns
     * @memberof Database
     */
    static getUserByName(username, callback) {
        if (utils.isEmpty(username)) return callback({ err: "Invalid parameters" });

        var db = Database.get();
        var user = db.get("users")
            .filter({ name: username })
            .take(1)
            .value();
        if (!user || !user.length) return callback({ err: "Not found" });
        callback(null, user[0]);
    }

    static addUser(username, password, role, callback) {
        if (utils.isEmpty(username) || utils.isEmpty(password) || utils.isEmpty(role)) return callback({ err: "Invalid parameters" });

        Database.getUserByName(username, (err, user) => {
            if (!err) return callback({ err: "User already exists" });
            var db = Database.get();
            db.get("users").push({
                "name": username,
                "password": password,
                "role": role
            }).write();
            callback(null, { "name": username, "role": role });
        });
    }

    static checkLogin(username, password, callback) {
        if (utils.isEmptyArr([username, password])) return callback({ err: "Invalid parameters" });

        Database.getUserByName(username, (err, user) => {
            if (err || user.password != password) return callback({ err: "Invalid username/password" });
            callback(null, user);
        });
    }

    static addOrder(table, seat, mealId, size, callback) {
        if (utils.isEmptyArr([table, seat, mealId, size])) return callback({ err: "Invalid parameters" });

        var db = Database.get();
        var table = db.get("tables").filter(x => x.name == table).value()[0];
        if (
            !table || seat < 0 || seat > table.seats - 1 ||
            db.get("menu").get("meals").filter(x => x.id == mealId).value().length == 0 ||
            db.get("menu").get("sizes").filter(x => x.size == size).value().length == 0)
            return callback({ err: "Invalid parameters" });

        var order = {
            "id": uuid.v4(),
            "table": table.name,
            "seat": seat,
            "meal": mealId,
            "size": size,
            "state": STATES.New
        };
        db.get("orders").push(order).write();
        callback(null, order);
    }

    static deleteOrder(orderId, callback) {
        Database.getOrderById(orderId, (err, order)=>{
            if (err) return callback(err);
            Database.get().get("orders").remove(order).write();
            callback(null, order);
        });
    }

    static getOrderById(orderId, callback) {
        if (utils.isEmpty(orderId)) return callback({ err: "Invalid parameters" });
        var order = Database.get().get("orders").filter(x => x.id == orderId).take(1).value()[0];
        if (!order) return callback({ err: "Invalid order id" });
        callback(null, order);
    }

    static setOrderState(orderId, state, callback) {
        if (!STATES.isValid(state)) return callback({ err: "Invalid parameters" });
        Database.getOrderById(orderId, (err, order) => {
            if (err) return callback(err);
            order.state = state;
            Database.get().get("orders").filter(x => x.id == orderId).assign(order).write();
            callback(null, order);
        });
    }

    static setOrderDeleted(orderId, deleted, callback) {
        Database.getOrderById(orderId, (err, order) => {
            if (err) return callback(err);
            order.deleted = deleted;
            Database.get().get("orders").filter(x => x.id == orderId).assign(order).write();
            callback(null, order);
        });
    }
}


Database.initialize("data.json");
Database.initializeTables();

module.exports = Database;