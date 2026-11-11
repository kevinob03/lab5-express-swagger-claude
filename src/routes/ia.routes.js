const router = require('express').Router();
const { z } = require('zod');
const validar = require('../middlewares/validar');
const deepseek = require('../services/deepseek.service');

const preguntaSchema = z.object({
  pregunta: z.string().min(3).max(2000),
});

/**
 * @openapi
 * /api/ia/preguntar:
 *   post:
 *     summary: Envía una pregunta a DeepSeek
 *     tags: [IA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Pregunta' }
 *     responses:
 *       200: { description: Respuesta generada }
 *       400: { description: Pregunta inválida }
 *       502: { description: DeepSeek no disponible }
 */
router.post('/preguntar', validar(preguntaSchema), async (req, res) => {
  const resultado = await deepseek.preguntar(req.body.pregunta);
  res.json(resultado);
});

module.exports = router;
