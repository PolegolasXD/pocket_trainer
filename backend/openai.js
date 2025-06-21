require('dotenv').config();
const OpenAI = require('openai');

if (!process.env.OPENAI_API_KEY) {
  throw new Error('A chave da API da OpenAI não está configurada no arquivo .env');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = openai; 
