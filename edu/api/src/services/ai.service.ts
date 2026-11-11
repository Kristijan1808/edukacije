import { env } from '../config/env.js';

export async function generateCourseOutline(material: string) {
  if (!env.ollamaUrl) throw new Error('Ollama nije konfigurirana.');

  const prompt = `Pretvori materijal u JSON niz lekcija. Svaka lekcija: title, summary, blocks (text ili quiz). Odgovori samo JSON.\nMaterijal:\n${material}`;
  const response = await fetch(`${env.ollamaUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: env.ollamaModel, prompt, stream: false, format: 'json' }),
  });

  if (!response.ok) throw new Error('Ollama greška.');
  const data = (await response.json()) as { response: string };
  return JSON.parse(data.response);
}
