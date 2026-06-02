import { spawnSync } from "node:child_process";
import type { SpawnSyncOptions } from "node:child_process";
import { EditorConfig, SupportedEditors } from "./types/types";
import { getEditor } from "./config.js";
const EDITORS: Record<SupportedEditors, EditorConfig> = {
  nvim: {
    bin: {
      linux: "nvim",
      win32: "nvim.exe",
    },
    args: (file, line) => [`+${line}`, file],
  },
  code: {
    bin: {
      linux: "code",
      win32: "code.cmd",
    },
    args: (file, line) => ["--goto", `${file}:${line}`],
  },
};
type Platform = "linux" | "win32";

function getPlatform(): Platform {
  return process.platform === "win32" ? "win32" : "linux";
}

function detectEditor(): SupportedEditors {
  const configured = getEditor();
  const env = configured ?? process.env.EDITOR ?? "";

  if (env.includes("nvim")) return "nvim";
  if (env.includes("code")) return "code";
  return getPlatform() === "win32" ? "code" : "nvim";
}

function getBin(editor: SupportedEditors): string {
  return EDITORS[editor].bin[getPlatform()];
}

function getArgs(
  editor: SupportedEditors,
  file: string,
  line: number,
): string[] {
  return EDITORS[editor].args(file, line);
}

export function openEditor(file: string, line: number): void {
  const editor = detectEditor();
  const bin = getBin(editor);
  const args = getArgs(editor, file, line);

  const options: SpawnSyncOptions = {
    stdio: "inherit",
    // code on windows needs a shell to resolve .cmd
    shell: getPlatform() === "win32" && editor === "code",
  };

  const result = spawnSync(bin, args, options);

  if (result.error) {
    throw new Error(`Failed to open editor: ${result.error.message}`);
  }
}
