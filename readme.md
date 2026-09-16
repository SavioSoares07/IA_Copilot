# 🤖 AI QA Copilot

Um framework de automação de testes que usa IA para **gerar** testes E2E a partir de requisitos ou relatos de bug, e para **diagnosticar e sugerir correções** quando esses testes falham, um ciclo de manutenção de testes assistido por IA, do zero à execução no CI.

## O problema que isso resolve

Em times de QA, dois problemas se repetem constantemente:

1. **Bugs reportados raramente viram testes de regressão.** Ficam registrados num card do Jira, e o time confia na memória de "lembrar de testar aquilo de novo" depois do fix.
2. **Testes E2E quebram com frequência por motivos triviais** : um seletor que mudou, uma rota que foi renomeada — e a manutenção consome tempo desproporcional ao valor que agrega.

O AI QA Copilot ataca os dois: transforma requisitos e bug reports em testes executáveis automaticamente, e usa IA para diagnosticar falhas reais de execução, sugerindo correções para revisão humana (nunca aplicação automática sem revisão).

## Como funciona

```
Entrada (requisito ou bug report)
        │
        ▼
Gerador de testes (IA) ──► Cenário Gherkin ──► Código Playwright + TS
        │
        ▼
Execução no CI/CD (GitHub Actions)
        │
        ▼ (se falhar)
Self-healing (IA) ──► Diagnóstico + correção sugerida ──► Revisão humana
```

1. **Entrada** — um requisito (US/PRD) ou um relato de bug, em texto simples, tipado como `{ kind: "requirement" | "bug", description: string }`
2. **Geração** — a IA (Gemini) interpreta o texto e gera um cenário Gherkin (Given/When/Then), que é então convertido em código Playwright + TypeScript executável
3. **Execução** — o teste roda normalmente, localmente ou no CI
4. **Self-healing** — se o teste falhar, o sistema lê o contexto real da falha (snapshot da página no momento do erro) e pede à IA um diagnóstico e uma correção, salvos em `healing-suggestions/` para revisão — nada é aplicado automaticamente
5. **Dashboard** — um HTML estático gerado localmente lista os testes criados e as sugestões de correção, para visualização rápida

## Um caso real

Durante o desenvolvimento, gerei um teste a partir do bug report _"ao tentar finalizar compra com carrinho vazio, o sistema deveria impedir ou avisar o usuário"_, testado contra o [SauceDemo](https://www.saucedemo.com) (aplicação pública de prática de automação).

O teste gerado falhou, em chromium, firefox e webkit, confirmado no CI. O módulo de self-healing analisou o snapshot real da página no momento da falha e diagnosticou corretamente que **a premissa do teste estava errada**: a aplicação não implementa nenhuma validação de carrinho vazio, simplesmente prossegue para a etapa de checkout. A correção sugerida ajustou o teste para refletir o comportamento real da aplicação, validado, ao aplicá-la, pelo CI passando nos três navegadores.

Esse ciclo completo (bug report → teste gerado → falha real → diagnóstico correto → correção aplicada → CI verde) é a prova de conceito central do projeto.

## Stack

- **TypeScript** + **Playwright** (`@playwright/test`) para automação E2E
- **Google Gemini API** (`@google/genai`) para geração de cenários e diagnóstico de falhas
- **GitHub Actions** para CI/CD, rodando em chromium, firefox e webkit
- **tsx** para execução direta de scripts TypeScript sem etapa de build

## Estrutura do projeto

```
src/
├── types.ts               # tipos compartilhados (Report, HealSuggestion, etc.)
├── generator/
│   ├── loader.ts           # lê e valida o report de entrada
│   ├── prompts.ts          # monta os prompts de geração (requirement/bug)
│   ├── aiClient.ts          # chamadas à API do Gemini + parsing das respostas
│   └── fileWriter.ts        # salva o código de teste gerado em tests/
├── healer/
│   ├── failureReader.ts     # lê o error-context.md e o código original do teste
│   ├── healPrompts.ts       # monta o prompt de diagnóstico/correção
│   ├── healer.ts             # orquestra o fluxo de self-healing
│   └── suggestionLogger.ts   # salva as sugestões em healing-suggestions/
└── dashboard/
    ├── collectData.ts        # varre tests/ e healing-suggestions/
    └── generateHtml.ts        # gera o dashboard/index.html

tests/                       # testes Playwright gerados (código, versionado)
healing-suggestions/         # sugestões de correção (markdown, para revisão)
dashboard/                   # dashboard HTML gerado
fixtures/                    # exemplos de requisitos/bugs de entrada
.github/workflows/           # pipeline de CI
```

## Rodando localmente

```bash
# instalar dependências
npm install
npx playwright install

# configurar a chave da API (Google AI Studio, camada gratuita)
echo "GEMINI_API_KEY=sua-chave-aqui" > .env

# gerar um teste a partir de um requisito/bug (ver fixtures/ para exemplos)
npx tsx src/playground.ts

# rodar os testes
npx playwright test

# gerar o dashboard
npx tsx src/playground.ts   # (com a função de dashboard habilitada)
```

## CI/CD

O workflow em `.github/workflows/playwright.yml` roda os testes automaticamente em push/PR para `main`, nos três navegadores principais, com upload do relatório HTML como artifact.

## Decisões de design

- **IA nunca aplica correções automaticamente.** Toda sugestão de self-healing é registrada para revisão humana, uma escolha deliberada de segurança, não uma limitação técnica.
- **Cada módulo (generator/healer) é independente do provedor de IA.** A chamada à API está isolada em uma única função (`callGemini`), permitindo trocar de provedor (testado também com a API da Anthropic) sem alterar o resto da lógica.
- **`exactOptionalPropertyTypes` e `noUncheckedIndexedAccess` ativos no TypeScript**, forçando tratamento explícito de valores possivelmente ausentes em toda a base de código.

## Próximos passos

- [ ] Abertura automática de Pull Request com a correção sugerida, em vez de apenas um log markdown
- [ ] Captura de DOM mais rica no momento da falha (além do `error-context.md` padrão do Playwright)
- [ ] Suporte a geração de testes de API, além de E2E

## Autor

Domingos Sávio Soares Nogueira — QA Analyst
[LinkedIn](https://www.linkedin.com/in/saviosoares07/) · [GitHub](https://github.com/SavioSoares07)
