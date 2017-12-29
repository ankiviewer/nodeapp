const Hapi = require('hapi');
const routes = require('./roots.js');
const port = process.env.PORT || 5555;
const sqlite3 = require('sqlite3').verbose();

const server = new Hapi.Server();
server.connection({ port });

const sqlitePath = process.env.ANKI_SQLITE_PATH || process.env.NODE_ENV == 'test';

if (!sqlitePath) {
  throw new Error('Missing $ANKI_SQLITE_PATH environment variable');
}

const db = (process.env.NODE_ENV || '').toUpperCase() === 'TEST'
  ? new sqlite3.Database(':memory:')
  : new sqlite3.Database(sqlitePath, sqlite3.READ_ONLY);

server.route(routes(db));

module.exports = { db, server };
