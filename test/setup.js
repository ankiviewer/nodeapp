const { db } = require('../src/config.js');
const { collection, notes } = require('./models.json'); 

module.exports = () => new Promise((resolve) => {
  db.serialize(() => {
    db.run('drop table if exists col');
    db.run(`
      create table col (
        crt integer not null,
        mod integer not null,
        models text not null,
        decks text not null,
        tags text not null
      )
    `);
    db.run(`
      insert into col (crt, mod, models, decks, tags)
      values (?, ?, ?, ?, ?)`,
      [collection.crt, collection.mod].concat(
        [collection.models, collection.decks, collection.tags].map(JSON.stringify)
      )
    );

    db.run('drop table if exists notes');
    db.run(`
      create table notes (
      id integer not null,
      mod integer not null,
      mid integer not null,
      tags text not null,
      flds text not null,
      sfld text not null
      )
    `);
    const noteStmt = db.prepare(`
      insert into notes (id, mod, mid, tags, flds, sfld)
      values (?, ?, ?, ?, ?, ?)
    `);
    notes
      .filter((note, index, self) => {
        return self.find((n) => {
          return index === self.map((nn) => nn.nid).indexOf(n.nid)
        });
      })
      .forEach((note) => {
        noteStmt.run([
          note.nid,
          note.nmod,
          note.mid,
          note.tags,
          note.flds,
          note.sfld
        ]);
      });

    noteStmt.finalize(() => {
      db.serialize(() => {
        db.run('drop table if exists cards');
        db.run(`
          create table cards (
          id integer not null,
          nid integer not null,
          did integer not null,
          mod integer not null,
          ord integer not null,
          type integer not null,
          queue integer not null,
          due integer not null,
          reps integer not null,
          lapses integer not null
          )
        `);
        const cardStmt = db.prepare(`
          insert into cards (id, nid, did, mod, ord, type, queue, due, reps, lapses)
          values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        notes.forEach((note) => {
          cardStmt.run([note.cid, note.nid, note.did, note.cmod, note.ord, note.type, note.queue, note.due, note.reps, note.lapses]);
        });
        cardStmt.finalize(resolve);
      });
    });
  });
});

