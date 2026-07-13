import { createSpinner } from "nanospinner";
import search from "@inquirer/search";
import chalk from "chalk";
import path from "path";

import { scanRepo, searchTodos, validateTodo, addRun, generateId, getRepoName, incrementStreak, resetStreak, getStats } from "@devds1989/trush-core";
import { openEditor } from "../editor.js";
import { createTimer } from "../timer.js";
import {
  badge,
  formatTodoChoice,
  formatValidation,
  printResult,
  printNoTodos,
  warn,
} from "../ui.js";
import type { TodoItem } from "@devds1989/trush-core";

async function pickTodo(items: TodoItem[]): Promise<TodoItem> {
  const answer = await search<TodoItem>({
    message: "Pick a TODO, FIXME, or BUG to fix",
    source: async (input) => {
      const term = (input ?? "").trim();
      const results = searchTodos(items, term);
      return results.map((item: TodoItem) => ({
        name: formatTodoChoice(item),
        value: item,
      }));
    },
  });

  return answer;
}

async function confirmComplete(): Promise<boolean> {
  const confirm = (await import("@inquirer/confirm")).default;
  return confirm({ message: "Did you complete it?" });
}

async function confirmAnyway(): Promise<boolean> {
  const confirm = (await import("@inquirer/confirm")).default;
  return confirm({
    message: chalk.yellow("TODO still present. Mark as complete anyway?"),
    default: false,
  });
}

export async function start(cwd: string = process.cwd()): Promise<void> {
  try {
  // 1. scan
  const scanSpinner = createSpinner("Scanning repo...").start();
  const items = await scanRepo(cwd);

  if (items.length === 0) {
    scanSpinner.success({ text: "Scan complete" });
    printNoTodos();
    return;
  }

  scanSpinner.success({
    text: `Found ${chalk.white.bold(items.length)} items`,
  });

  // 2. pick
  const picked = await pickTodo(items);
  const filePath = path.resolve(cwd, picked.file);

  console.log();
  console.log(
    `  ${badge(picked.type)} ${chalk.dim(picked.file)}${chalk.dim(":") + chalk.cyan(picked.line)}`,
  );
  console.log(`  ${chalk.gray('"' + picked.text + '"')}`);
  console.log();

  // 3. open editor + timer
  const timerSpinner = createSpinner(
    "Timer running — close editor to stop",
  ).start();
  const timer = createTimer();
  openEditor(filePath, picked.line);
  const timerResult = timer.stop();
  timerSpinner.success({ text: chalk.white(timerResult.formatted) });

  // 4. validate
  const validateSpinner = createSpinner("Validating...").start();
  await new Promise((res) => setTimeout(res, 600)); // brief pause so it feels intentional
  const validation = validateTodo(
    filePath,
    picked.line,
    picked.rawLine,
    picked.type,
  );
  validateSpinner.stop();

  console.log(`  ${formatValidation(validation)}`);
  console.log();

  // 5. confirm
  let completed = false;

  if (validation.status === "done") {
    completed = await confirmComplete();
  } else if (validation.status === "unchanged") {
    console.log(`  ${warn("Still seeing the " + picked.type)}`);
    completed = await confirmAnyway();
  } else if (validation.status === "missing") {
    completed = await confirmComplete();
  }

  // 6. update streak + stats
  const streak = completed ? incrementStreak(picked.type) : resetStreak();

  const stats = getStats();

  // 7. save run
  addRun({
    id: generateId(),
    repo: getRepoName(cwd),
    file: picked.file,
    line: picked.line,
    text: picked.text,
    type: picked.type,
    startedAt: timerResult.startedAt,
    finishedAt: timerResult.finishedAt,
    duration: timerResult.duration,
    completed,
  });

  // 8. result card
  printResult({
    item: picked,
    duration: timerResult.formatted,
    streak,
    stats,
    completed,
  });
  } catch (err: any) {
    if (err.name === "ExitPromptError") {
      console.log(chalk.red("\nAborted by user."));
      process.exit(1);
    }
    throw err;
  }
}
