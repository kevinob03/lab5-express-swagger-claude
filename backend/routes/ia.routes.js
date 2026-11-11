const router = require('express').Router();
const { z } = require('zod');
const validar = require('../middlewares/validar');
const controller = require('../controller/ia.controller');

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
router.post('/preguntar', validar(preguntaSchema), controller.preguntar);

module.exports = router;
