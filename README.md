<div align="center">

<img width="1160" height="294" alt="T-rush" src="https://github.com/user-attachments/assets/95492e22-c5c1-4c9c-b80c-aaf8ad252f82" />


# t-rush

**Speedrun your technical debt.**

Find, fix, and track TODO · FIXME · BUG comments across your codebase with a timer, streaks, and history.

[![npm version](https://img.shields.io/npm/v/@devds1989/t-rush?color=black&style=flat-square)](https://www.npmjs.com/package/@devds1989/t-rush)
[![license](https://img.shields.io/github/license/DevDs1989/trush?color=black&style=flat-square)](./LICENSE)
[![node](https://img.shields.io/node/v/@devds1989/t-rush?color=black&style=flat-square)](https://nodejs.org)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-black?style=flat-square)

</div>

---

## Why t-rush?

Every codebase has them. `TODO: fix this later`. `FIXME: crashes on edge case`. `BUG: don't touch`. They pile up, get ignored, and quietly rot.

t-rush turns fixing them into a focused, timed session. Pick a comment, open your editor, fix it, confirm it is done. Streak goes up. Quit halfway and the streak resets. Simple.

### 🤖 Want to let AI fix it for you?
Try **[t-rush-mcp](https://github.com/DevDs1989/trush-mcp)** to expose your TODOs directly to AI Agents (like Antigravity or Claude) so they can find, prioritize, and resolve issues autonomously while updating your local streak!



---

## Features

- **Smart scanner** finds `TODO`, `FIXME`, and `BUG` across all languages
- **Fuzzy picker** lets you filter by file, type, or comment text instantly
- **Timer** tracks exactly how long each fix takes
- **Validator** checks if the comment was actually removed after you close the editor
- **Streaks** count consecutive completions and reset when you quit a run
- **History** keeps a full log of every run with filters
- **Stats** show completion rate, avg time, fastest run, and top repo
- **Local first** stores everything in `~/.t-rush/data.json` with no accounts and no telemetry
- **Cross-platform** on Linux, macOS, and Windows


---

## Install

```bash
npm i -g @devds1989/t-rush
```

**Requirements:** Node.js 18+

---

## Quick Start

```bash
# scan current repo and start a run
trush start

# scan a specific directory
trush start ~/projects/my-app
```

---

## How a run works

<img width="1200" height="600" alt="demo" src="https://github.com/user-attachments/assets/75b909b8-e835-41f3-8ff4-112a3ef1c6bc" />


---

## Commands

<img width="1000" height="600" alt="demo" src="https://github.com/user-attachments/assets/da18aaa1-015d-4851-b3a3-4cc039047ea4" />


### `trush start [dir]`

Scan a repo and start a speedrun. Defaults to current directory.

```bash
trush start
trush start ~/projects/my-app
```

### `trush history`

View past runs. Shows the 20 most recent by default.

```bash
trush history
trush history --limit 50
trush history --type FIXME
trush history --type BUG
trush history --repo my-app
trush history --completed
trush history --aborted
```

| Flag | Description |
|---|---|
| `-l, --limit <n>` | number of runs to show (default: 20) |
| `-t, --type <type>` | filter by `TODO`, `FIXME`, or `BUG` |
| `-r, --repo <name>` | filter by repo name |
| `--completed` | show only completed runs |
| `--aborted` | show only aborted runs |

### `trush stats`

View your streak, completion rate, average time, and more.

```bash
trush stats
```
---

## Streak system

Streaks count **consecutive completed runs**, not days.

| Action | Effect |
|---|---|
| Complete a run | streak + 1 |
| Quit or abort a run | streak resets to 0 |
| View stats | shows current, last, and longest streak |

Your longest streak is never lost even when the current streak resets.

---

## Editor support

t-rush reads your `$EDITOR` environment variable and opens the file at the exact line number.

```bash
export EDITOR=nvim   # add to ~/.zshrc or ~/.bashrc
```

| Editor | Flag used |
|---|---|
| `nvim` / `vim` | `+{line} {file}` |
| `code` (VSCode) | `--goto {file}:{line}` |

No `$EDITOR` set? t-rush defaults to `nvim` on Linux/macOS and `code` on Windows.

---

## Supported languages

t-rush detects `TODO`, `FIXME`, and `BUG` in all common comment styles:

| Style | Languages |
|---|---|
| `//` | JavaScript, TypeScript, Go, Rust, C, C++, Java, Kotlin, Swift, Dart |
| `#` | Python, Ruby, Shell, YAML, R, Perl, Elixir, Crystal |
| `--` | SQL, Lua, Haskell, Ada |
| `%` | Erlang, LaTeX |
| `;` | Lisp, Clojure, Assembly |
| `*` | Inside `/* */` block comments |

Author annotations are supported too:

```ts
// TODO(dev): fix this
// FIXME(alice): handle null case
```

---

## Data storage

All data is stored locally with no network requests and no accounts.

| Platform | Location |
|---|---|
| Linux / macOS | `~/.t-rush/data.json` |
| Windows | `C:\Users\<username>\.t-rush\data.json` |

Writes are atomic so if the process crashes mid-write your data stays safe.

---

## Project structure

```
src/
├── index.ts          # CLI entry point
├── types.ts          # shared types and CommentType enum
├── scanner.ts        # repo walker and comment parser
├── editor.ts         # editor spawn and line targeting
├── validator.ts      # post-edit comment removal check
├── timer.ts          # run timer
├── store.ts          # read/write ~/.t-rush/data.json
├── streak.ts         # streak and stats logic
├── ui.ts             # chalk styles and result card
└── commands/
    ├── start.ts      # main run flow
    ├── history.ts    # past runs display
    └── stats.ts      # stats display
```

---

## Contributing

Contributions are welcome. Please open an issue before submitting a large PR.

```bash
git clone https://github.com/DevDs1989/trush
cd trush
npm install
npm run dev -- start
```

---

## License

[MIT](./LICENSE) © Dev
