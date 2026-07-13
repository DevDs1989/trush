import chalk from "chalk";
import { loadData, RunRecord } from "@devds1989/trush-core";
import { badge } from "../ui.js";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function statusIcon(completed: boolean): string {
  return completed ? chalk.green("✔") : chalk.red("✘");
}

function printRow(run: RunRecord): void {
  const date = chalk.dim(formatDate(run.startedAt));
  const status = statusIcon(run.completed);
  const type = badge(run.type);
  const file = chalk.dim(run.file + ":" + run.line);
  const text = chalk.white(
    run.text.length > 40 ? run.text.slice(0, 40) + "…" : run.text,
  );
  const duration = chalk.cyan(formatDuration(run.duration));
  const repo = chalk.gray(`[${run.repo}]`);

  console.log(`  ${status}  ${date}  ${type}  ${duration}  ${file}`);
  console.log(`        ${text}  ${repo}`);
  console.log();
}

type HistoryOptions = {
  limit?: number;
  type?: string;
  repo?: string;
  completed?: boolean;
};

function filterRuns(runs: RunRecord[], opts: HistoryOptions): RunRecord[] {
  let filtered = [...runs].reverse(); // most recent first

  if (opts.type) {
    const t = opts.type.toUpperCase();
    filtered = filtered.filter((r) => r.type === t);
  }

  if (opts.repo) {
    filtered = filtered.filter((r) => r.repo.includes(opts.repo!));
  }

  if (opts.completed !== undefined) {
    filtered = filtered.filter((r) => r.completed === opts.completed);
  }

  if (opts.limit) {
    filtered = filtered.slice(0, opts.limit);
  }

  return filtered;
}

export function history(opts: HistoryOptions = {}): void {
  const data = loadData();

  if (data.runs.length === 0) {
    console.log();
    console.log(chalk.gray("  No runs yet. Start one with: trush start"));
    console.log();
    return;
  }

  const runs = filterRuns(data.runs, { limit: 20, ...opts });

  if (runs.length === 0) {
    console.log();
    console.log(chalk.gray("  No runs match that filter."));
    console.log();
    return;
  }

  const width = 50;
  const line = chalk.gray("─".repeat(width));

  console.log();
  console.log(chalk.white.bold("  Run History"));
  console.log(
    chalk.gray(`  showing ${runs.length} of ${data.runs.length} total`),
  );
  console.log();
  console.log(line);
  console.log();

  runs.forEach(printRow);

  console.log(line);
  console.log();
}
