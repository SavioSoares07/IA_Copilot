import { resourceUsage } from "node:process";
import { Report } from "../types";

const OUTPUT_INSTRUCTIONS = `
    Responda APENAS com um bloco JSON valido, sem texto antes ou depois, no formato:
    {
        "scenario_name" : "nome curto do cenário",
        "gherkin" : "Feature: ...\\nScenario: ...\\nGiven ...\\nWhen ...\\nThen ..."
    }
        Não inclua markdown, comentários ou explicação fora do JSON.
`;

const CODE_OUTPUT_INSTRUCTIONS = `
Responda APENAS com um bloco JSON válido, sem texto antes ou depois, no formato:

{
  "file_name": "nome-do-arquivo-em-kebab-case.spec.ts",
  "code": "import { test, expect } from '@playwright/test';\\n\\ntest('...', async ({ page }) => {\\n  ...\\n});"
}

Não inclua markdown, comentários ou explicações fora do JSON.
`;
//Criação do prompt para gerar Requerimento

function buildRequirementPrompt(description: string): string {
  return `
    Você é um engenheiro de QA sênior especializado em automação de testes E2E com Playwright.

    Dado o seguinte requisito, gere um cenário Gherkin (Given/When/Then) cobrindo o fluxo principal descrito, incluindo pelo menos um caso de sucesso e um caso de borda relevante.

    Requisito:
    """
        ${description}
    """

    ${OUTPUT_INSTRUCTIONS}
    `.trim();
}

//Criação do prompt para gerar BUG

function buildBugPrompt(description: string): string {
  return `
    Você é um engenheiro de QA sênior especializado em automação de testes E2E com Playwright.

    Dado o seguinte relato de bug, gere um cenário Gherkin (Given/When/Then) que reproduz exatamente o comportamento descrito. O objetivo é um teste de regressão: o cenário deve falhar hoje (reproduzindo o bug) e passar quando o bug for corrigido.

    Relato de bug:
    """
    ${description}
    """

    ${OUTPUT_INSTRUCTIONS}
`.trim();
}

//Criação do prompt final

export function buildPrompt(report: Report): string {
  if (report.kind === "bug") {
    return buildBugPrompt(report.description);
  }
  return buildRequirementPrompt(report.description);
}

export function buildCodePrompt(gherkin: string): string {
  return `
Você é um engenheiro de QA sênior especializado em Playwright + TypeScript.

Converta o cenário Gherkin abaixo em um teste Playwright completo e executável, usando a sintaxe test() do @playwright/test. Use seletores semânticos (getByRole, getByText, getByLabel) sempre que possível, em vez de seletores CSS frágeis.

Gherkin:
"""
${gherkin}
"""

${CODE_OUTPUT_INSTRUCTIONS}
`.trim();
}
