import { TimerResult } from "@devds1989/trush-core";

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}h ${m}m ${s}s`;
  } else if (m > 0) {
    return `${m}m ${s}s`;
  }
  return `${s}s`;
}

export function createTimer() {
  const startedAt = new Date();
  const startMs = Date.now();

  function stop(): TimerResult {
    const finishedAt = new Date();
    const duration = Math.floor((Date.now() - startMs) / 1000);

    return {
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      duration,
      formatted: formatDuration(duration),
    };
  }

  return { stop };
}
