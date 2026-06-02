import fs from "fs";
import path from "path";
import os from "os";
import { AppConfig } from "./types/types";

const CONFIG_DIR = path.join(os.homedir(), ".t-rush");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

export function loadConfig(): AppConfig {
  if (!fs.existsSync(CONFIG_FILE)) return {};

  try {
    const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
    return JSON.parse(raw) as AppConfig;
  } catch {
    return {};
  }
}

export function saveConfig(config: AppConfig): void {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });

  const tmp = CONFIG_FILE + ".tmp";
  try {
    fs.writeFileSync(tmp, JSON.stringify(config, null, 2), "utf-8");
    fs.renameSync(tmp, CONFIG_FILE);
  } catch (err) {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    throw err;
  }
}

export function setEditor(editor: string): void {
  const config = loadConfig();
  config.editor = editor;
  saveConfig(config);
}

export function getEditor(): string | undefined {
  return loadConfig().editor;
}
