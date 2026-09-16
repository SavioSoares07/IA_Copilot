import * as fs from "fs";
import * as path from "path";

export function saveTestFile(fileName: string, code: string): string {
  const testsDir = path.join(process.cwd(), "tests");

  if (!fs.existsSync(testsDir)) {
    fs.mkdirSync(testsDir, { recursive: true });
  }

  const filePath = path.join(testsDir, fileName);
  fs.writeFileSync(filePath, code, "utf-8");

  return filePath;
}
