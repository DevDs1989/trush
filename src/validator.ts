import fs from "fs";
import { CommentType } from "./types/types.js";
import { ValidationResult } from "./types/types.js";

const COMMENT_REGEX = /(?:TODO|FIXME|BUG)(?:\(.*?\))?[:\s]/i;

function scanWindow(
  lines: string[],
  line: number,
  originalText: string,
): boolean {
  const start = Math.max(0, line - 10);
  const end = Math.min(lines.length, line + 10);
  const window = lines.slice(start, end);

  return window.some((l) => l.includes(originalText.trim()));
}

export function validateTodo(
  file: string,
  line: number,
  originalText: string,
  type: CommentType,
): ValidationResult {
  // file missing or deleted
  if (!fs.existsSync(file)) {
    return {
      status: "missing",
      message: `${file} not found — was it deleted or moved?`,
    };
  }

  const lines = fs.readFileSync(file, "utf-8").split("\n");
  const exactLine = lines[line - 1]; // 1-indexed

  // exact line no longer exists (file got shorter)
  if (!exactLine) {
    return {
      status: "done",
      message: `Line ${line} no longer exists — looks done.`,
    };
  }

  // exact line still has a TODO/FIXME/BUG comment
  if (COMMENT_REGEX.test(exactLine)) {
    // check ±10 window in case user edited around it but didn't remove it
    const foundInWindow = scanWindow(lines, line - 1, originalText);

    if (foundInWindow) {
      return {
        status: "unchanged",
        message: `${type} still present at ${file}:${line}`,
      };
    }
  }

  return {
    status: "done",
    message: `${type} resolved in ${file}`,
  };
}
