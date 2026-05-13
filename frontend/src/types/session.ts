import type { PomodoroRequest, PomodoroResponse } from "./pomodoro";

export type SessionRequest = {
  sessionConfigurationId: string;
  startedAt?: string;
  endedAt?: string | null;
  workMinutesUsed?: number;
  shortBreakDurationUsed?: number;
  longBreakDurationUsed?: number;
  pomodoros?: PomodoroRequest[];
};

export type SessionResponse = {
  id: string;
  startedAt: string;
  endedAt: string | null;
  workMinutesUsed: number;
  shortBreakDurationUsed: number;
  longBreakDurationUsed: number;
  taskIds: string[];
  pomodoros: PomodoroResponse[];
  sessionConfigurationId: string;
};