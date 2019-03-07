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
}

module.exports = Database;