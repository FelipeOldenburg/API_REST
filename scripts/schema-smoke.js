const assert = require('node:assert/strict');
const Module = require('node:module');

const queries = [];
const load = Module._load;
Module._load = (name, ...args) => name === 'mysql2/promise'
  ? { createPool: () => ({ execute: async (query) => { queries.push(query); return [[]]; } }) }
  : load(name, ...args);

const db = require('../src/config/database');

(async () => {
  await db.execute('SELECT 1');
  await db.execute('SELECT 2');
  assert.equal(queries.length, 5);
  assert.match(queries[0], /CREATE TABLE IF NOT EXISTS helpdesk_usuarios/);
  assert.match(queries[1], /CREATE TABLE IF NOT EXISTS helpdesk_chamados/);
  assert.match(queries[2], /CREATE TABLE IF NOT EXISTS helpdesk_comentarios_chamado/);
  console.log('schema smoke ok');
})().catch((error) => { console.error(error); process.exit(1); });
