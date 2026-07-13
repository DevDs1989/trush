import chalk from "chalk";
import { StreakInfo, StatsInfo, TodoItem, ValidationResult, CommentType } from "@devds1989/trush-core";

// colors
export function badge(type: TodoItem["type"]): string {
  switch (type) {
    case CommentType.TODO:
      return chalk.bgBlue.white.bold(` TODO `);
    case CommentType.FIXME:
      return chalk.bgYellow.black.bold(` FIXME `);
    case CommentType.BUG:
      return chalk.bgRed.white.bold(` BUG `);
    default:
      return chalk.bgGray.white.bold(` ${type} `);
  }
}

export function formatTodoChoice(item: TodoItem): string {
  return `${badge(item.type)} ${chalk.dim(item.file)}${chalk.dim(":") + chalk.cyan(item.line)} ${chalk.white(item.text)}`;
}

export function label(text: string): string {
  return chalk.gray(text);
}

export function success(text: string): string {
  return chalk.green(`✔ ${text}`);
}

export function failure(text: string): string {
  return chalk.red(`✘ ${text}`);
}

export function warn(text: string): string {
  return chalk.yellow(`⚠ ${text}`);
}

export function info(text: string): string {
  return chalk.cyan(`ℹ ${text}`);
}

export function formatValidation(result: ValidationResult): string {
  switch (result.status) {
    case "done":
      return success(result.message);
    case "unchanged":
      return warn(result.message);
    case "missing":
      return info(result.message);
    default:
      return info(result.message || "Unknown validation status");
  }
}

type ResultCardOptions = {
  item: TodoItem;
  duration: string;
  streak: StreakInfo;
  stats: StatsInfo;
  completed: boolean;
};

export function printResult(opts: ResultCardOptions): void {
  const { item, duration, streak, stats, completed } = opts;

  const width = 50;
  const line = chalk.gray("─".repeat(width));

  console.log();
  console.log(line);
  console.log();

  // status
  if (completed) {
    console.log(
      `  ${chalk.green.bold("✔")}  ${badge(item.type)} ${chalk.white.bold("resolved")}`,
    );
  } else {
    console.log(
      `  ${chalk.red.bold("✘")}  ${badge(item.type)} ${chalk.white.bold("aborted")}`,
    );
  }

  // file + text
  console.log(`  ${chalk.dim(item.file + ":" + item.line)}`);
  console.log(`  ${chalk.gray('"' + item.text + '"')}`);
  console.log();

  // time
  console.log(`  ${chalk.cyan("⏱")}  ${chalk.white(duration)}`);
  console.log();

  // streak
  if (completed) {
    console.log(
      `  ${chalk.yellow("")} Streak:   ${chalk.white.bold(streak.current)}  ${chalk.dim(`(longest: ${streak.longest})`)}`,
    );
  } else {
    console.log(
      `  ${chalk.gray("")} Streak reset  ${chalk.dim(`(last: ${streak.last}  longest: ${streak.longest})`)}`,
    );
  }

  // stats
  console.log();
  console.log(
    `  ${chalk.dim("TODO:")}   ${chalk.white(stats.byType[CommentType.TODO])}   ${chalk.dim("FIXME:")} ${chalk.white(stats.byType[CommentType.FIXME])}   ${chalk.dim("BUG:")} ${chalk.white(stats.byType[CommentType.BUG])}`,
  );
  console.log(
    `  ${chalk.dim("Completed:")} ${chalk.green(stats.totalCompleted)}   ${chalk.dim("Aborted:")} ${chalk.red(stats.totalAborted)}`,
  );

  console.log();
  console.log(line);
  console.log();
}

export function printNoTodos(): void {
  console.log();
  console.log(success("No TODOs, FIXMEs, or BUGs found. Clean codebase!"));
  console.log();
}
