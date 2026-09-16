import * as fs from "fs";
import * as path from "path";
import { DashboardData } from "../types";
import { collectDashboardData } from "./collectData";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderTestRow(fileName: string, createdAt: string): string {
  const date = new Date(createdAt).toLocaleString("pt-BR");
  return `<tr><td>${fileName}</td><td>${date}</td></tr>`;
}

function renderSuggestionCard(
  testName: string,
  diagnosis: string,
  suggestedFix: string,
  createdAt: string,
): string {
  const date = new Date(createdAt).toLocaleString("pt-BR");
  return `
    <div class="card">
      <h3>${testName}</h3>
      <p class="diagnosis">${diagnosis}</p>
      <pre><code>${escapeHtml(suggestedFix)}</code></pre>
      <span class="date">${date}</span>
    </div>
  `;
}

function buildHtml(data: DashboardData): string {
  const testRows = data.tests
    .map((t) => renderTestRow(t.fileName, t.createdAt))
    .join("");
  const suggestionCards = data.suggestions
    .map((s) =>
      renderSuggestionCard(
        s.testName,
        s.diagnosis,
        s.suggestedFix,
        s.createdAt,
      ),
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>AI QA Copilot — Dashboard</title>
  <style>
    body { font-family: -apple-system, sans-serif; margin: 40px; background: #0f0f0f; color: #e0e0e0; }
    h1 { color: #8b5cf6; }
    h2 { border-bottom: 1px solid #333; padding-bottom: 8px; margin-top: 40px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { text-align: left; padding: 10px; border-bottom: 1px solid #2a2a2a; }
    th { color: #999; font-weight: 500; }
    .card { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
    .card h3 { margin: 0 0 8px; color: #8b5cf6; }
    .diagnosis { color: #ccc; line-height: 1.5; }
    .date { color: #777; font-size: 0.85em; }
    pre { background: #0a0a0a; border: 1px solid #2a2a2a; border-radius: 6px; padding: 12px; overflow-x: auto; margin: 12px 0; }
code { font-family: 'Fira Code', Consolas, monospace; font-size: 0.85em; color: #a5f3c9; }
  </style>
</head>
<body>
  <h1>🤖 AI QA Copilot</h1>

  <h2>Testes gerados (${data.tests.length})</h2>
  <table>
    <thead><tr><th>Arquivo</th><th>Criado em</th></tr></thead>
    <tbody>${testRows}</tbody>
  </table>

  <h2>Sugestões de self-healing (${data.suggestions.length})</h2>
  ${suggestionCards || "<p>Nenhuma sugestão ainda.</p>"}
</body>
</html>
  `.trim();
}

export function generateDashboard(): string {
  const data = collectDashboardData();
  const html = buildHtml(data);

  const outputDir = path.join(process.cwd(), "dashboard");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "index.html");
  fs.writeFileSync(outputPath, html, "utf-8");

  return outputPath;
}
