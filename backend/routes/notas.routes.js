const router = require('express').Router();
const { z } = require('zod');
const validar = require('../middlewares/validar');
const controller = require('../controller/notas.controller');

const notaSchema = z.object({
  titulo: z.string().min(1).max(100),
  contenido: z.string().min(1).max(5000),
});

/**
 * @openapi
 * /api/notas:
 *   get:
 *     summary: Lista todas las notas
 *     tags: [Notas]
 *     responses:
 *       200:
 *         description: Lista de notas
 */
router.get('/', controller.listar);

/**
 * @openapi
 * /api/notas/{id}:
 *   get:
 *     summary: Obtiene una nota por ID
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Nota encontrada }
 *       404: { description: Nota no encontrada }
 */
router.get('/:id', controller.obtener);

/**
 * @openapi
 * /api/notas:
 *   post:
 *     summary: Crea una nota
 *     tags: [Notas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Nota' }
 *     responses:
 *       201: { description: Nota creada }
 *       400: { description: Datos inválidos }
 */
router.post('/', validar(notaSchema), controller.crear);

/**
 * @openapi
 * /api/notas/{id}:
 *   delete:
 *     summary: Elimina una nota
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Nota eliminada }
 *       404: { description: Nota no encontrada }
 */
router.delete('/:id', controller.eliminar);

/**
 * @openapi
 * /api/notas/{id}/resumen:
 *   post:
 *     summary: Resume una nota en tres viñetas
 *     tags: [Notas, IA]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Resumen generado junto con el uso de tokens }
 *       404: { description: Nota no encontrada }
 *       502: { description: DeepSeek no disponible }
 */
router.post('/:id/resumen', controller.resumir);

module.exports = router;
