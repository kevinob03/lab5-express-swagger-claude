const notas = require('../models/notas.model');
const deepseek = require('../services/deepseek.service');

exports.listar = (req, res) => res.json(notas.listar());
exports.obtener = (req, res) => res.json(notas.buscar(Number(req.params.id)));
exports.crear = (req, res) => res.status(201).json(notas.crear(req.body));
exports.eliminar = (req, res) => {
  notas.eliminar(Number(req.params.id));
  res.status(204).end();
};
exports.resumir = async (req, res) => {
  const nota = notas.buscar(Number(req.params.id));
  const resultado = await deepseek.preguntar(
    nota.contenido,
    'Resume el texto en 3 viñetas breves, en español.'
  );
  res.json({ notaId: nota.id, resumen: resultado.respuesta, uso: resultado.uso });
};
