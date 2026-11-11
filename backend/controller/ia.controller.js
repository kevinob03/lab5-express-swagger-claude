const deepseek = require('../services/deepseek.service');

exports.preguntar = async (req, res) => {
  const resultado = await deepseek.preguntar(req.body.pregunta);
  res.json(resultado);
};
