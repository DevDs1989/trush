import { loadData, saveData } from "./store";
import { CommentType } from "./types/types";
import { StreakInfo, StatsInfo } from "./types/types";

export function incrementStreak(type: CommentType): StreakInfo {
  const data = loadData();
  data.streak.current += 1;
  data.streak.longest = Math.max(data.streak.longest, data.streak.current);
  data.stats.totalCompleted += 1;
  data.stats.byType[type] += 1;
  saveData(data);
  return { ...data.streak };
}

export function resetStreak(): StreakInfo {
  const data = loadData();
  data.streak.last = data.streak.current;
  data.streak.current = 0;
  data.stats.totalAborted += 1;
  saveData(data);
  return { ...data.streak };
}

export function getStreak(): StreakInfo {
  const data = loadData();
  return { ...data.streak };
}

export function getStats(): StatsInfo {
  const data = loadData();
  return { ...data.stats };
}
