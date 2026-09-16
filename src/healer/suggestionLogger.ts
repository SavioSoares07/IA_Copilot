import * as fs from "fs";
import * as path from "path";
import { HealSuggestion } from "../types";

export function saveSuggestion(
  testFilePath: string,
  suggestion: HealSuggestion,
): string {
  const suggestionsDir = path.join(process.cwd(), "healing-suggestions");

  if (!fs.existsSync(suggestionsDir)) {
    fs.mkdirSync(suggestionsDir, { recursive: true });
  }

  const testName = path.basename(testFilePath, ".spec.ts");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `${testName}_${timestamp}.md`;
  const filePath = path.join(suggestionsDir, fileName);

  const content = `# Sugestão de correção — ${testName}

**Data:** ${new Date().toISOString()}
**Teste original:** \`${testFilePath}\`

## Diagnóstico

${suggestion.diagnosis}

## Correção sugerida

\`\`\`typescript
${suggestion.suggested_fix}
\`\`\`

---
*Sugestão gerada automaticamente pela IA. Revise antes de aplicar.*
`;

  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
}
