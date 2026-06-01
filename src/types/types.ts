export const CommentType = {
  TODO: "TODO",
  FIXME: "FIXME",
  BUG: "BUG",
} as const;

export type CommentType = (typeof CommentType)[keyof typeof CommentType];

export type TodoItem = {
  type: CommentType;
  file: string;
  line: number;
  text: string;
  rawLine: string;
};

export type RunRecord = {
  id: string;
  repo: string;
  file: string;
  line: number;
  text: string;
  type: CommentType;
  startedAt: string;
  finishedAt: string;
  duration: number;
  completed: boolean;
};

export type StreakInfo = {
  current: number;
  last: number;
  longest: number;
};

export type StatsInfo = {
  totalCompleted: number;
  totalAborted: number;
  byType: Record<CommentType, number>;
};

export type AppData = {
  runs: RunRecord[];
  streak: StreakInfo;
  stats: StatsInfo;
};

export type TimerResult = {
  startedAt: string;
  finishedAt: string;
  duration: number;
  formatted: string; // formatted like "1m 30s"
};

export type SupportedEditors = "code" | "nvim";

export type EditorConfig = {
  bin: {
    linux: string;
    win32: string;
  };
  args: (file: string, line: number) => string[];
};

export type ValidationStatus = "done" | "unchanged" | "missing";

export type ValidationResult = {
  status: ValidationStatus;
  message: string;
};
