import { loadReport } from "./generator/loader";
import { generateScenario, generateTestCode } from "./generator/aiClient";
import { saveTestFile } from "./generator/fileWriter";

async function main() {
  const report = loadReport("fixtures/valid-bug.json");
  const scenario = await generateScenario(report);
  console.log("Gherkin gerado:", scenario.gherkin);

  const testCode = await generateTestCode(scenario.gherkin);
  const savedPath = saveTestFile(testCode.file_name, testCode.code);
  console.log("Teste salvo em:", savedPath);
}

main().catch((err) => console.error("Erro:", err.message));
