import { loadReport } from "./generator/loader";
import { generateScenario, generateTestCode } from "./generator/aiClient";
import { saveTestFile } from "./generator/fileWriter";
import { healTest } from "./healer/healer";
import { generateDashboard } from "./dashboard/generateHtml";

async function main() {
  const report = loadReport("fixtures/valid-bug.json");
  const scenario = await generateScenario(report);
  console.log("Gherkin gerado:", scenario.gherkin);

  const testCode = await generateTestCode(scenario.gherkin);
  const savedPath = saveTestFile(testCode.file_name, testCode.code);
  console.log("Teste salvo em:", savedPath);
}

async function testHealer() {
  const testFilePath = "tests/checkout-carrinho-vazio.spec.ts";
  const errorContextPath =
    "test-results/checkout-carrinho-vazio-Pr-a55a0-checkout-com-carrinho-vazio-chromium/error-context.md";

  const result = await healTest(testFilePath, errorContextPath);
  console.log("Diagnóstico:", result.suggestion.diagnosis);
  console.log("Sugestão salva em:", result.savedPath);
}

function testDashboard() {
  const outputPath = generateDashboard();
  console.log("Dashboard gerado em:", outputPath);
}

testDashboard();
