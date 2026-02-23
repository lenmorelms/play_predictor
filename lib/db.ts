import { readFile, writeFile } from "fs/promises"
import path from "path"

const dataDir = path.join(process.cwd(), "data")

export async function readJson<T>(filename: string): Promise<T> {
  const filePath = path.join(dataDir, filename)
  const raw = await readFile(filePath, "utf-8")
  return JSON.parse(raw)
}

export async function writeJson<T>(filename: string, data: T): Promise<void> {
  const filePath = path.join(dataDir, filename)
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
}
