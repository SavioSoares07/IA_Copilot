import * as fs from "fs";
import * as path from "path";
import { DashboardData, TestEntry, SuggestionEntry } from "../types";

function collectTests(): TestEntry[] {
  const testsDir = path.join(process.cwd(), "tests");
  if (!fs.existsSync(testsDir)) return [];

  return fs
    .readdirSync(testsDir)
    .filter((f) => f.endsWith(".spec.ts"))
    .map((fileName) => {
      const stat = fs.statSync(path.join(testsDir, fileName));
      return { fileName, createdAt: stat.birthtime.toISOString() };
    });
}

function extractDiagnosis(content: string): string {
  const match = content.match(/## Diagnóstico\s*\n\s*(.+)/);
  return match?.[1]?.trim() ?? "Diagnóstico não encontrado";
}

function extractTestName(content: string): string {
  const match = content.match(/\*\*Teste original:\*\* `(.+)`/);
  return match?.[1]?.trim() ?? "Desconhecido";
}

function extractSuggestedFix(content: string): string {
  const match = content.match(/```typescript\s*\n([\s\S]+?)\n```/);
  return match?.[1]?.trim() ?? "Código não encontrado";
}

function collectSuggestions(): SuggestionEntry[] {
  const suggestionsDir = path.join(process.cwd(), "healing-suggestions");
  if (!fs.existsSync(suggestionsDir)) return [];

  return fs
    .readdirSync(suggestionsDir)
    .filter((f) => f.endsWith(".md"))
    .map((fileName) => {
      const filePath = path.join(suggestionsDir, fileName);
      const content = fs.readFileSync(filePath, "utf-8");
      const stat = fs.statSync(filePath);

      return {
        fileName,
        testName: extractTestName(content),
        diagnosis: extractDiagnosis(content),
        suggestedFix: extractSuggestedFix(content),
        createdAt: stat.birthtime.toISOString(),
      };
    });
}

export function collectDashboardData(): DashboardData {
  return {
    tests: collectTests(),
    suggestions: collectSuggestions(),
  };
}
