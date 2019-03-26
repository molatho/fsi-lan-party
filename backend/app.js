const path = require('path')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const Database = require('./database')

const auth = require('./routes/auth')
const pizza = require('./routes/pizza')

console.log("Initializing database...");
Database.initialize("data.json");
console.log("Applying default values...");
Database.get().defaults(JSON.parse(fs.readFileSync("data.default.json"))).write();
console.log("> Database ready!");

const app = express()
app.set('trust proxy', 1)
app.use(session({
  secret: 'öadsokfgfölkjs',
  resave: false,
  saveUninitialized: true,
  //cookie:{ secure: true } //HTTPS only
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  store: new FileStore()
}));

app.use(express.static(path.join(__dirname, 'public')))
app.use('/.well-known', express.static(path.join(__dirname, '.well-known'), {}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', auth);
app.use('/pizza', pizza);

app.set('port', process.env.PORT || 7777)

const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});