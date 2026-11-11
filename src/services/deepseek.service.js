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
    messages: [
      {
        role: 'system',
        content: system || 'Eres un asistente útil. Responde en español.',
      },
      { role: 'user', content: texto },
    ],
  });

  return {
    respuesta: respuesta.choices[0]?.message?.content || '',
    uso: {
      input_tokens: respuesta.usage?.prompt_tokens ?? 0,
      output_tokens: respuesta.usage?.completion_tokens ?? 0,
    },
  };
}

module.exports = { preguntar };
