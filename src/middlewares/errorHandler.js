const OpenAI = require('openai');

module.exports = (err, req, res, next) => {
  if (err instanceof OpenAI.APIError) {
    console.error('DeepSeek API:', err.status, err.message);
    const status = err.status === 429 ? 429 : err.status === 503 ? 503 : 502;
    return res.status(status).json({ error: 'IA_NO_DISPONIBLE' });
  }

  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  console.error(err);
  return res.status(500).json({ error: 'Error interno' });
};
