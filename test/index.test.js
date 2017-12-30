const tape = require('tape');
const dbSetup = require('./setup.js');
const { collection, notes } = require('./models.json');
const { server, db } = require('../src/config.js');

tape('setup', (t) => dbSetup(db).then(t.end));

tape('GET :: /ping', (t) => {
  server.inject('/ping')
    .then((res) => {
      t.equal(res.statusCode, 200);
      t.equal(res.payload, 'pong');
      t.end();
    });
});

tape('GET :: /collection', (t) => {
  server.inject('/collection')
    .then((res) => {
      t.equal(res.statusCode, 200);
      t.deepEqual(JSON.parse(res.payload), collection);
      t.end();
    });
});

tape('GET :: /notes', (t) => {
  server.inject('/notes')
    .then((res) => {
      t.equal(res.statusCode, 200);
      t.deepEqual(JSON.parse(res.payload), notes);
      t.end();
    });
});

