// backend/teste.js
const db = require('./db');

db.raw('SELECT 1+1 AS resultado')
  .then(data => {
    console.log('Conexão OK!', data.rows);
    return db.destroy();
  })
  .catch(err => {
    console.error('Erro de conexão:', err.message);
  });
