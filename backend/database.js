const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

var db;

class Database {
    static initialize(path) {
        db = low(new FileSync(path));
    }

    static get() {
        return db;
    }

    static checkTokens() {
        var db = Database.get();
        var tableNames = ["Alfa", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliett"];
        var tables = db.get("tables").value();
        var tokens = db.get("tokens").value();
        if (!tables) { tables = {}; }
        if (!tokens) { tokens = {}; }

        for (var i = 0; i < tableNames.length; i++) {
            if (tables[tableNames[i]] === undefined) {
                tables[tableNames[i]] = {
                    tokens: []
                };
            }
        }
    }
}

Database.initialize("data.json");

module.exports = Database;