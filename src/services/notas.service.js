const { AppError } = require('../utils/errors');
const Database = require('better-sqlite3');
const fs = require('node:fs');
const path = require('node:path');

const databasePath = process.env.DATABASE_PATH
  ? path.resolve(process.env.DATABASE_PATH)
  : path.join(__dirname, '../../data/notas.db');
fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const db = new Database(databasePath);
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS notas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    contenido TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const getAll = db.prepare(
  'SELECT id, titulo, contenido FROM notas ORDER BY id DESC'
);
const getById = db.prepare(
  'SELECT id, titulo, contenido FROM notas WHERE id = ?'
);
const insert = db.prepare(
  'INSERT INTO notas (titulo, contenido) VALUES (?, ?)'
);
const remove = db.prepare('DELETE FROM notas WHERE id = ?');

function listar() {
  return getAll.all();
}

function buscar(id) {
  const nota = getById.get(id);
  if (!nota) throw new AppError(404, 'Nota no encontrada');
  return nota;
}

function crear({ titulo, contenido }) {
  const result = insert.run(titulo, contenido);
  return buscar(Number(result.lastInsertRowid));
}

function eliminar(id) {
  buscar(id);
  remove.run(id);
}

module.exports = { listar, buscar, crear, eliminar };
