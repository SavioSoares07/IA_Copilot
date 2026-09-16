import { callGemini } from "../generator/aiClient";
import { buildHealPrompt } from "./healPrompts";
import { readFailureContext, readOriginalTestCode } from "./failureReader";
import { HealSuggestion } from "../types";
import { saveSuggestion } from "./suggestionLogger";

function parseHealSuggestion(raw: string): HealSuggestion {
  let cleaned = raw.trim();
  cleaned = cleaned
    .replace(/^```json\s*/, "")
    .replace(/```$/, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`A resposta da IA não é um JSON válido:\n${raw}`);
  }

  const obj = parsed as Partial<HealSuggestion>;
  if (!obj.diagnosis || !obj.suggested_fix) {
    throw new Error(`JSON da IA está faltando campos esperados:\n${raw}`);
  }

  return { diagnosis: obj.diagnosis, suggested_fix: obj.suggested_fix };
}

export async function healTest(
  testFilePath: string,
  errorContextPath: string,
): Promise<{ suggestion: HealSuggestion; savedPath: string }> {
  const originalCode = readOriginalTestCode(testFilePath);
  const failureContext = readFailureContext(errorContextPath);

  const prompt = buildHealPrompt(originalCode, failureContext);
  const raw = await callGemini(prompt);
  const suggestion = parseHealSuggestion(raw);

  const savedPath = saveSuggestion(testFilePath, suggestion);

  return { suggestion, savedPath };
}
