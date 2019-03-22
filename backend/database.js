const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const utils = require("./utils");

var db;
const TOKENS_PER_TABLE = 8;
const TOKEN_LENGTH = 8;
const TABLE_NAMES = ["Alfa", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliett"];

class Database {
    static initialize(path) {
        db = low(new FileSync(path));
    }

    static get() {
        return db;
    }

    /**
     * Returns whether a token with the given id already exists.
     *
     * @static
     * @param {*} tokenId
     * @returns
     * @memberof Database
     */
    static tokenExists(tokenId) {
        var db = Database.get();
        var tables = db.get("tables").value();
        var _tableNames = Object.keys(tables);

        for (var _tableIdx = 0; _tableIdx < _tableNames.length; _tableIdx++) {
            var table = tables[_tableNames[_tableIdx]];
            if (table === undefined || !table.tokens || !table.tokens.length) {
                continue;
            }
            if (table.tokens[tokenId] !== undefined) {
                return true;
            }
        }
        return false;
    }

    /**
     * Creates a new unique token-id.
     *
     * @static
     * @param {*} length
     * @returns
     * @memberof Database
     */
    static createTokenId(length) {
        var id = '';
        do {
            id = utils.makeid(8);
        } while (Database.tokenExists(id));
        return id;
    }

    /**
     * Returns the name of the table that contains the given token-id.
     * (Or none if the token was not found)
     * 
     * @static
     * @param {*} tokenId
     * @returns
     * @memberof Database
     */
    static getTableNameByToken(tokenId) {
        var db = Database.get();
        var tables = db.get("tables").value();
        var _tableNames = Object.keys(tables);
        for (var _tableIdx = 0; _tableIdx < _tableNames.length; _tableIdx++) {
            var table = tables[_tableNames[_tableIdx]];
            if (table.tokens[tokenId] !== undefined) { return _tableNames[_tableIdx]; }
        }
        return null;
    }

    /**
     * Creates and populates tables and their tokens and makes sure that a working environment is established.
     *
     * @static
     * @memberof Database
     */
    static initializeTablesAndTokens() {
        var db = Database.get();
        var tables = db.get("tables").value();
        if (!tables) { tables = {}; }

        for (var _tableNameIdx = 0; _tableNameIdx < TABLE_NAMES.length; _tableNameIdx++) {
            var table = tables[TABLE_NAMES[_tableNameIdx]];
            //Create table if not exists
            if (table === undefined) {
                console.log("Creating table ", TABLE_NAMES[_tableNameIdx], "!");
                table = {
                    tokens: {}
                };
                tables[TABLE_NAMES[_tableNameIdx]] = table;
            }
            var _tableTokens = Object.keys(table.tokens);
            for (var _tokenIdx = 0; _tokenIdx < TOKENS_PER_TABLE; _tokenIdx++) {
                var token = table.tokens[_tableTokens[_tokenIdx]];
                if (token === undefined) {
                    var id = Database.createTokenId(TOKEN_LENGTH);
                    var token = {
                        "user": null
                    };
                    table.tokens[id] = token;
                    console.log(" > Created token ", id, ".");
                }
                token.user = null;
            }
        }
        db.set("tables", tables).write();
    }

    /**
     * Clears all data related to tables and tokens
     *
     * @static
     * @memberof Database
     */
    static clearTables() {
        var db = Database.get();
        db.set("tables", {}).write();
    }

    /**
     * Clears all information of a given token
     *
     * @static
     * @param {*} tokenId
     * @param {*} callback
     * @returns
     * @memberof Database
     */
    static clearToken(tokenId, callback) {
        var name = Database.getTableNameByToken(tokenId);
        if (name == null) return callback("Token not found");

        var db = Database.get();
        db.get("tables").get(name).get("tokens").get(tokenId).set("user", null).write();
        return callback();
    }
}

Database.initialize("data.json");
Database.clearTables();
Database.initializeTablesAndTokens();

module.exports = Database;