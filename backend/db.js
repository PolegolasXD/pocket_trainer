const knex = require('knex');
const config = require('./knexfile');

// Aqui usamos a configuração correta (development)
const db = knex(config.development);

module.exports = db;
