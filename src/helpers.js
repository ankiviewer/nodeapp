const getCollection = (db) => new Promise((resolve, reject) => {
  db.get(
    'select models, decks, tags, mod, crt from col',
    (err, {models, decks, tags, mod, crt}) => {
      /* istanbul ignore if */
      if (err) {
        reject(err);
        return;
      }
      resolve({
        models: JSON.parse(models),
        decks: JSON.parse(decks),
        tags: JSON.parse(tags),
        mod,
        crt
      });
    }
  );
});

const getNotes = (db) => new Promise((resolve, reject) => {
  db.all(
  `SELECT
  cards.id AS cid,
  notes.id AS nid,
  cards.mod AS cmod,
  notes.mod AS nmod,
  notes.mid AS mid,
  notes.tags AS tags,
  notes.flds AS flds,
  notes.sfld AS sfld,
  cards.did AS did,
  cards.ord AS ord,
  cards.type AS type,
  cards.queue AS queue,
  cards.due AS due,
  cards.reps AS reps,
  cards.lapses AS lapses
  FROM
  notes
  INNER JOIN cards
  ON
  notes.id = cards.nid`,
  (err, notes) => {
    /* istanbul ignore if */
    if (err) {
      reject(err);
      return;
    }
    resolve(notes);
  });
});

module.exports = { getCollection, getNotes }
