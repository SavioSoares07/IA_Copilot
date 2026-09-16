const HEAL_OUTPUT_INSTRUCTIONS = `
Responda APENAS com um bloco JSON válido, sem texto antes ou depois, no formato:

{
  "diagnosis": "explicação curta do motivo provável da falha",
  "suggested_fix": "código Playwright corrigido, completo, pronto pra substituir o original"
}

Não inclua markdown, comentários ou explicações fora do JSON.
`;

export function buildHealPrompt(
  originalCode: string,
  failureContext: string,
): string {
  return `
Você é um engenheiro de QA sênior especializado em manutenção de testes Playwright.

O teste abaixo falhou durante a execução. Analise o código original e o contexto da falha (snapshot da página no momento do erro) para diagnosticar a causa provável e sugerir uma correção.

Código original do teste:
"""
${originalCode}
"""

Contexto da falha (snapshot da página):
"""
${failureContext}
"""

${HEAL_OUTPUT_INSTRUCTIONS}
`.trim();
}
