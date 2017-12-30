const { getCollection, getNotes } = require('./helpers.js');

/* istanbul ignore next */
const handleErr = (err) => console.log('ERR: ', err); // eslint-disable-line

const routes = (db) => [
  {
    method: 'get',
    path: '/ping',
    handler: (request, reply) => reply('pong')
  },
  {
    method: 'get',
    path: '/collection',
    handler: (_request, reply) => {
      getCollection(db)
        .then(reply)
        .catch(handleErr);
    }
  },
  {
    method: 'get',
    path: '/notes',
    handler: (_request, reply) => {
      getNotes(db)
        .then(reply)
        .catch(handleErr);
    }
  }
]

module.exports = routes;
