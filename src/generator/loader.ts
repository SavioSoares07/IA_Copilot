import * as fs from "fs";
import type { Report } from "../types.ts";

export function loadReport(path: string): Report {
  const content = fs.readFileSync(path, "utf-8");
  const dados = JSON.parse(content);
  return validateReport(dados);
}

export function validateReport(dados: any): Report {
  if (dados.kind !== "requirement" && dados.kind !== "bug") {
    throw new Error("Tipo inválido: Precisa ser 'Requerimento' ou 'Bug'");
  }

  if (!dados.description || dados.description.trim() === "") {
    throw new Error("Descrição não pode ser vazia");
  }

  return dados as Report;
}
