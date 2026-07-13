import chalk from "chalk";
import { loadData, getStreak, getStats, CommentType, RunRecord } from "@devds1989/trush-core";

// ── Helpers ──────────────────────────────────────────────────────────────────

function avgDuration(runs: RunRecord[]): string {
  const completed = runs.filter((r) => r.completed && r.duration > 0);
  if (completed.length === 0) return "N/A";

  const avg = Math.floor(
    completed.reduce((acc, r) => acc + r.duration, 0) / completed.length,
  );
  const m = Math.floor(avg / 60);
  const s = avg % 60;

  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function fastestRun(runs: RunRecord[]): string {
  const completed = runs.filter((r) => r.completed && r.duration > 0);
  if (completed.length === 0) return "N/A";

  const fastest = completed.reduce((a, b) => (a.duration < b.duration ? a : b));
  const m = Math.floor(fastest.duration / 60);
  const s = fastest.duration % 60;

  const time = m > 0 ? `${m}m ${s}s` : `${s}s`;
  return `${time} ${chalk.dim(`(${fastest.file}:${fastest.line})`)}`;
}

function completionRate(runs: RunRecord[]): string {
  if (runs.length === 0) return "N/A";
  const rate = Math.round(
    (runs.filter((r) => r.completed).length / runs.length) * 100,
  );
  const color =
    rate >= 80 ? chalk.green : rate >= 50 ? chalk.yellow : chalk.red;
  return color(`${rate}%`);
}

function topRepo(runs: RunRecord[]): string {
  if (runs.length === 0) return "N/A";

  const counts: Record<string, number> = {};
  runs.forEach((r) => {
    counts[r.repo] = (counts[r.repo] ?? 0) + 1;
  });

  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return `${chalk.white(top[0])} ${chalk.dim(`(${top[1]} runs)`)}`;
}

function row(label: string, value: string): void {
  const padded = label.padEnd(20, " ");
  console.log(`  ${chalk.dim(padded)} ${value}`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

export function stats(): void {
  const data = loadData();
  const streak = getStreak();
  const s = getStats();
  const runs = data.runs;

  const width = 50;
  const line = chalk.gray("─".repeat(width));

  console.log();
  console.log(chalk.white.bold("  Stats"));
  console.log();
  console.log(line);
  console.log();

  // streak
  console.log(`  ${chalk.yellow.bold("Streak")}`);
  row("Current", chalk.white.bold(String(streak.current)));
  row("Last", chalk.white(String(streak.last)));
  row("Longest", chalk.white(String(streak.longest)));
  console.log();

  // runs
  console.log(`  ${chalk.cyan.bold("Runs")}`);
  row("Completed", chalk.green(String(s.totalCompleted)));
  row("Aborted", chalk.red(String(s.totalAborted)));
  row("Completion rate", completionRate(runs));
  console.log();

  // by type
  console.log(`  ${chalk.white.bold("By Type")}`);
  row("TODO", chalk.blue(String(s.byType[CommentType.TODO])));
  row("FIXME", chalk.yellow(String(s.byType[CommentType.FIXME])));
  row("BUG", chalk.red(String(s.byType[CommentType.BUG])));
  console.log();

  // performance
  console.log(`  ${chalk.white.bold("Performance")}`);
  row("Avg time", chalk.white(avgDuration(runs)));
  row("Fastest run", fastestRun(runs));
  row("Top repo", topRepo(runs));
  console.log();

  console.log(line);
  console.log();
}
