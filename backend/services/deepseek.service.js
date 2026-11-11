const OpenAI = require('openai');
const { AppError } = require('../utils/errors');

let cliente;

function obtenerCliente() {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new AppError(503, 'IA_NO_DISPONIBLE');
  }

  if (!cliente) {
    cliente = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com',
    });
  }

  return cliente;
}

async function preguntar(texto, system) {
  const respuesta = await obtenerCliente().chat.completions.create({
    model: process.env.DEEPSEEK_MODEL || 'deepseek-flash',
    max_tokens: 1024,
    thinking: { type: 'disabled' },
    messages: [
      {
        role: 'system',
        content: system || 'Eres un asistente útil. Responde en español.',
      },
      { role: 'user', content: texto },
    ],
  });

  const mensaje = respuesta.choices[0]?.message;
  const contenido = mensaje?.content;
  const respuestaTexto = typeof contenido === 'string'
    ? contenido.trim()
    : Array.isArray(contenido)
      ? contenido.filter((bloque) => bloque.type === 'text').map((bloque) => bloque.text).join('\n').trim()
      : '';

  if (!respuestaTexto) {
    throw new AppError(502, 'DeepSeek no devolvió una respuesta de texto. Intenta nuevamente.');
  }

  return {
    respuesta: respuestaTexto,
    uso: {
      input_tokens: respuesta.usage?.prompt_tokens ?? 0,
      output_tokens: respuesta.usage?.completion_tokens ?? 0,
    },
  };
}

module.exports = { preguntar };
