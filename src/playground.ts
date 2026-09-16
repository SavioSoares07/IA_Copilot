import { loadReport } from "./generator/loader";
import { generateScenario } from "./generator/aiClient";

async function main() {
  const report = loadReport("fixtures/valid-bug.json");
  console.log("Report carregado:", report);

  const scenario = await generateScenario(report);
  console.log("Cenário gerado pela IA:");
  console.log(scenario);
}

main().catch((err) => {
  console.error("Erro:", err.message);
});
