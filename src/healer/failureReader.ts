import * as fs from "fs";

export function readFailureContext(path: string): string {
  if (!fs.existsSync(path)) {
    throw new Error(`Arquivo de contexto de falha não encontrado: ${path}`);
  }

  return fs.readFileSync(path, "utf-8");
}

export function readOriginalTestCode(path: string): string {
  if (!fs.existsSync(path)) {
    throw new Error(`Arquivo de teste não encontrado: ${path}`);
  }
  return fs.readFileSync(path, "utf-8");
}
