const db = require('../db');

async function createUser({ name, email, password, role }) {
  return await db('users').insert({ name, email, password, role }).returning('*');
}

async function getAllUsers() {
  return await db('users').select('*');
}

async function getUserById(id) {
  return await db('users').where({ id }).first();
}

async function updateUser(id, data) {
  return await db('users').where({ id }).update(data).returning('*');
}

async function deleteUserById(id) {
  return await db('users').where({ id }).del();
}

async function getUserByEmail(email) {
  return await db('users').where({ email }).first();
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUserById,
  getUserByEmail
};
