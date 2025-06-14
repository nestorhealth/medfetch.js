import 'dotenv/config';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Checks if AI-powered cleaning is enabled via the AI_CLEANING environment variable.
 * (AI_CLEANING=1 enables it.)
 */
export function isAICleaningEnabled(): boolean {
  return process.env.AI_CLEANING === "1";
}

/**
 * Calls OpenAI to validate and suggest fixes for a FHIR resource.
 * Returns an object: { [fhirPath: string]: suggestion | null }
 */
export async function aiValidate(resource: any): Promise<{ [path: string]: string | null }> {
  const prompt = `Here is a FHIR resource object that may have missing or anomalous fields:
${JSON.stringify(resource, null, 2)}

For each field that seems invalid, return "path: suggestion" or "path: null" if OK. Output as key-value pairs.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: "You are a FHIR data quality expert. Suggest fixes for missing or anomalous fields."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.2
  });

  const text = completion.choices[0].message.content;
  // Parse key-value pairs (format: path: suggestion)
  const result: { [path: string]: string | null } = {};
  if (text) {
    for (const line of text.split('\n')) {
      const match = line.match(/^([\w.\[\]'"/]+):\s*(.+)$/);
      if (match) {
        const path = match[1].trim();
        const value = match[2].trim();
        result[path] = value === 'null' ? null : value;
      }
    }
  }
  return result;
} 