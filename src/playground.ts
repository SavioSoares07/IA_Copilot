import { loadReport } from "./generator/loader";

console.log(loadReport("fixtures/valid-bug.json"));

try {
  loadReport("fixtures/invalid-bug.json");
} catch (e) {
  console.log("Erro esperado:", (e as Error).message);
}
