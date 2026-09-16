import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
import { Report } from "../types";
import { buildPrompt } from "./prompts";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY não está definida no .env");
}

const ai = new GoogleGenAI({ apiKey });

interface GeneratedScenario {
  scenario_name: string;
  gherkin: string;
}

async function callGemini(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  if (!response.text) {
    throw new Error("A resposta da IA não contém texto.");
  }

  return response.text;
}

function parseScenario(raw: string): GeneratedScenario {
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

  const obj = parsed as Partial<GeneratedScenario>;
  if (!obj.scenario_name || !obj.gherkin) {
    throw new Error(`JSON da IA está faltando campos esperados:\n${raw}`);
  }

  return { scenario_name: obj.scenario_name, gherkin: obj.gherkin };
}

export async function generateScenario(
  report: Report,
): Promise<GeneratedScenario> {
  const prompt = buildPrompt(report);
  const raw = await callGemini(prompt);
  return parseScenario(raw);
}
