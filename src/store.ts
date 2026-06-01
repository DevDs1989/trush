import fs from "fs";
import path from "path";
import os from "os";
import { RunRecord, AppData } from "./types/types";
import { CommentType } from "./types/types";

const DATA_DIR = path.join(os.homedir(), ".t-rush");
const DATA_FILE = path.join(DATA_DIR, "data.json");

const DEFAULT_DATA: AppData = {
  runs: [],
  streak: {
    current: 0,
    last: 0,
    longest: 0,
  },
  stats: {
    totalCompleted: 0,
    totalAborted: 0,
    byType: {
      [CommentType.TODO]: 0,
      [CommentType.FIXME]: 0,
      [CommentType.BUG]: 0,
    },
  },
};

export function loadData(): AppData {
  if (!fs.existsSync(DATA_DIR)) return structuredClone(DEFAULT_DATA);

  try {
    const content = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(content) as AppData;
  } catch {
    return structuredClone(DEFAULT_DATA);
  }
}

export function saveData(data: AppData): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  const tmp = DATA_FILE + ".tmp";

  try {
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tmp, DATA_FILE);
  } catch (err) {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    throw err;
  }
}

export function addRun(record: RunRecord): void {
  const data = loadData();
  data.runs.push(record);
  saveData(data);
}

export function getRepoName(cwd: string = process.cwd()): string {
  const parts = cwd.split(path.sep);
  return parts[parts.length - 1] || "unknown-repo";
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
