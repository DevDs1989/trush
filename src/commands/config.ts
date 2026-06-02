import chalk from "chalk";
import { setEditor, loadConfig } from "../config.js";

export function config(opts: { editor?: string }): void {
  if (opts.editor) {
    setEditor(opts.editor);
    console.log();
    console.log(
      chalk.green(`✔ Editor set to ${chalk.white.bold(opts.editor)}`),
    );
    console.log(chalk.dim("  this will be used for all future runs"));
    console.log();
    return;
  }

  // show current config if no flags passed
  const current = loadConfig();
  console.log();
  console.log(chalk.white.bold("  Config"));
  console.log();
  console.log(
    `  ${chalk.dim("editor")}   ${chalk.white(current.editor ?? "not set (using $EDITOR)")}`,
  );
  console.log();
}
