#!/usr/bin/env node

import { Command } from "commander";
import { start } from "./commands/start.js";
import { history } from "./commands/history.js";
import { stats } from "./commands/stats.js";

const program = new Command();

program
  .name("t-rush")
  .description("Speedrun your TODOs, FIXMEs, and BUGs")
  .version("0.1.0");

program
  .command("start")
  .description("scan repo, pick a TODO and start a speedrun")
  .argument("[dir]", "directory to scan", process.cwd())
  .action(async (dir: string) => {
    await start(dir);
  });

program
  .command("history")
  .description("show past runs")
  .option("-l, --limit <n>", "number of runs to show", "20")
  .option("-t, --type <type>", "filter by type: TODO, FIXME, BUG")
  .option("-r, --repo <name>", "filter by repo name")
  .option("--completed", "show only completed runs")
  .option("--aborted", "show only aborted runs")
  .action((opts) => {
    history({
      limit: parseInt(opts.limit),
      type: opts.type,
      repo: opts.repo,
      completed: opts.completed ? true : opts.aborted ? false : undefined,
    });
  });

program
  .command("stats")
  .description("show streak, completion rate and performance")
  .action(() => {
    stats();
  });

program.parse();
