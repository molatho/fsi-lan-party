const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const utils = require("./utils");
const uuid = require("uuid");

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
                        "userid": null
                    };
                    table.tokens[id] = token;
                    console.log(" > Created token ", id, ".");
                }
                token.userid = null;
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


    /**
     * Gathers information about the given token (id, tablename, user)
     *
     * @static
     * @param {*} tokenId
     * @returns
     * @memberof Database
     */
    static getTokenInformation(tokenId) {
        var name = Database.getTableNameByToken(tokenid);
        if (name == null) return null;
        var token = db.get("tables").get("name").get("tokens").get(tokenId);
        var user = Database.getUserById(token.userid);
        return {
            "tokenId": tokenId,
            "table": name,
            "user": user
        };
    }

    /**
     * Gets a user by its user id
     *
     * @static
     * @param {*} userid
     * @returns
     * @memberof Database
     */
    static getUserById(userid) {
        var db = Database.get();
        var user = db.get("users")
            .filter({ id: userid })
            .take(1)
            .value();
        if (!user || !user.length) return null;
        return user[0];
    }

    /**
     * Returns the information 
     *
     * @static
     * @param {string} token
     * @param {string} username
     * @param {function} callback
     * @returns
     * @memberof Database
     */
    static checkLogin(token, username, callback) {
        var db = Database.get();
        var token = Database.getTokenInformation(token);
        if (token == null) return callback({ err: "Invalid token" });
        if (token.user == null) return callback({ err: "Invalid token or username" });

        return callback(null, token);
    }

    /**
     * Registers a user to the given token
     *
     * @static
     * @param {*} token
     * @param {*} username
     * @param {*} callback
     * @returns
     * @memberof Database
     */
    static registerUser(token, username, callback) {
        var db = Database.get();
        var token = Database.getTokenInformation(token);

        if (token == null) return callback("Invalid token.");
        if (token.user != null) return callback("Token already registered");

        var user = Database.get().get('users')
            .filter({ username: username })
            .take(1)
            .value();
        if (user && user.length > 0) {
            return callback('Username already taken');
        }

        user = {
            username: username,
            token: token,
            id: uuid.v1(),
            role: "user"
        };

        var user = db.get('users').push(user).write();
        db.get('tables').get(token.table).get("tokens").get(req.body.token).set("userid", user.id).write();
        callback(null, user);
    }

    static getAllRegisteredTokens() {
        var registeredTokens = [];
        var tables = Database.get().get("tables").value();
        var tableNames = Object.value(tables);
        for (var _tableNameIdx in tableNames) {
            var table = tables[tableNames[_tableNameIdx]];
            var tokens = Object.keys(table.tokens);
            for (var tokenId in tokens) {
                var token = table.tokens[tokens[tokenId]];
                if (token.userid !== null)
                {
                    registeredTokens.push(Database.getTokenInformation(tokens[tokenId]));
                }
            }
        }
        return registeredTokens;
    }
}

Database.initialize("data.json");
Database.clearTables();
Database.initializeTablesAndTokens();

module.exports = Database;