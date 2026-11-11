export const env = {
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  uploadsDirectory: process.env.UPLOADS_DIRECTORY || 'uploads',
  ollamaUrl: process.env.OLLAMA_URL,
  ollamaModel: process.env.OLLAMA_MODEL || 'gemma3:4b',
};
